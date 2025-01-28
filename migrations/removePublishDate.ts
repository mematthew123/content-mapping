import {getCliClient} from 'sanity/cli';

async function removePublishDate() {
  const client = getCliClient();
/* This function reverses the addPublishDate migration by setting the publishDate field to null for documents where it is '1970-01-01'. 
 For testing purposes we will only process the first 5 documents */
   const query = `*[_type == "post" && publishDate == '1970-01-01'][0...5]._id`;
  const documentIds = await client.fetch(query);

  console.log(`Found ${documentIds.length} documents to update:`);
  console.log(documentIds);

  const batchSize = 5;
  let processedIds: string[] = [];

  for (let i = 0; i < documentIds.length; i += batchSize) {
    const batch = documentIds.slice(i, i + batchSize);
    console.log(`\n🔧 Processing batch ${i / batchSize + 1} with IDs:`);
    console.log(batch);

    try {
      await client
        .transaction()
        .patch(batch, (patch) => patch.set({publishDate: null}))
        .commit();
      
      processedIds = [...processedIds, ...batch];
      console.log(`✅ Successfully processed batch ${i / batchSize + 1}`);
    } catch (error) {
      console.error(`❌ Error processing batch ${i / batchSize + 1}:`, error);
    }
  }

  console.log('\n🏁 Migration complete. Summary:');
  console.log(`Total documents attempted: ${documentIds.length}`);
  console.log(`Successfully processed: ${processedIds.length}`);
  console.log('Processed document IDs:', processedIds);
}

removePublishDate().catch(console.error);