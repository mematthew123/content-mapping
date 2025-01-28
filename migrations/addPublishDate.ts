import { getCliClient } from "sanity/cli";

async function addPublishDate() {
    const client = getCliClient();
    // Fetch first 5 document IDs where publishDate is missing or null
    const query =
        '*[_type == "post" && (!defined(publishDate) || publishDate == null)][0...5]._id';
    const documentIds = await client.fetch(query);

    console.log(`📄 Found ${documentIds.length} documents to migrate:`);
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
                .patch(batch, (patch) => patch.set({ publishDate: "1970-01-01" }))
                .commit();

            processedIds = [...processedIds, ...batch];
            console.log(`✅ Successfully migrated batch ${i / batchSize + 1}`);
        } catch (error) {
            console.error(`❌ Error migrating batch ${i / batchSize + 1}:`, error);
        }
    }

    console.log('\n🏁 Migration complete. Summary:');
    console.log(`• Total documents attempted: ${documentIds.length}`);
    console.log(`• Successfully processed: ${processedIds.length}`);
    console.log('• Processed document IDs:', processedIds);
}

addPublishDate().catch(console.error);