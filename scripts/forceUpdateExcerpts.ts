import {getCliClient} from 'sanity/cli';

async function migrateDocuments() {
  const client = getCliClient();
  
  // Fetch documents with either old or missing excerpt
  const query = `*[_type == "postType" && (excerpt == "Here is our excerpt text" || !defined(excerpt))]._id`;
  const documentIds = await client.fetch(query);

  if (documentIds.length === 0) {
    console.log('No documents to update');
    return;
  }

  const batchSize = 100;
  for (let i = 0; i < documentIds.length; i += batchSize) {
    const batch = documentIds.slice(i, i + batchSize);
    
    const transaction = client.transaction();
    interface SanityPatch {
      set: {
        excerpt: string;
      };
      unset: string[];
    }

        batch.forEach((id: string) => 
          transaction.patch(id, {
            set: {excerpt: 'Updated excerpt text'},
            unset: [] // Optional: Add any fields to remove
          } as SanityPatch)
        );

    await transaction.commit();
    console.log(`Updated batch ${i / batchSize + 1}/${Math.ceil(documentIds.length / batchSize)}`);
  }
}

migrateDocuments().catch(console.error);