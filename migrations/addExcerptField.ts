import {getCliClient} from 'sanity/cli'
 // Create mutations array
 interface SanityDocument {
    _id: string;
}

interface MutationPatch {
    patch: {
        id: string;
        set: {
            excerpt: string;
        };
    };
}

async function migrateDocuments() {
  const client = getCliClient()
  
  // Query all post documents - we want to update all of them regardless of excerpt field
  const documents = await client.fetch(`*[_type == "post"]{ _id }`)
  
  console.log(`Found ${documents.length} documents to update`)

  // Create mutations array - force update all posts with the new excerpt
const mutations: MutationPatch[] = documents.map((doc: SanityDocument): MutationPatch => ({
    patch: {
        id: doc._id,
        set: {
            excerpt: "Here is our fancy new excerpt text!"
        }
    }
}))

  if (mutations.length === 0) {
    console.log('No documents found to update')
    return
  }

  // Execute mutations in batches
  const batchSize = 100
  for (let i = 0; i < mutations.length; i += batchSize) {
    const batch = mutations.slice(i, i + batchSize)
    
    try {
      await client.mutate(batch)
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}, updated ${batch.length} documents`)
      console.log('Updated documents:', batch.map(m => m.patch.id).join(', '))
    } catch (err) {
      console.error('Error processing batch:', err)
      throw err
    }
  }

  console.log('Migration completed!')
}

migrateDocuments().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})