import { getDocumentations, getCategories, getSubcategories } from './docs/index.js';

/**
 * Tes sederhana untuk memastikan dokumentasi dimuat dengan benar
 */
async function testDocumentationLoading() {
  console.log('=== Testing Documentation Loading ===');
  
  try {
    // Load dokumentasi
    const docs = await getDocumentations();
    console.log(`✅ Loaded ${Object.keys(docs).length} documents`);
    
    // Cek kategori
    const categories = await getCategories();
    console.log(`✅ Found ${categories.length} categories: ${categories.join(', ')}`);
    
    // Cek subcategories untuk setiap kategori
    for (const category of categories) {
      const subcategories = await getSubcategories(category);
      console.log(`✅ Category "${category}" has ${subcategories.length} subcategories`);
      
      // Hitung dokumen per kategori
      const docsInCategory = Object.values(docs).filter(doc => doc.category === category);
      console.log(`✅ Category "${category}" has ${docsInCategory.length} documents`);
      
      // Cek beberapa dokumen dari kategori ini
      const sampleDocs = Object.entries(docs)
        .filter(([_, doc]) => doc.category === category)
        .slice(0, 3)
        .map(([id, _]) => id);
      
      if (sampleDocs.length > 0) {
        console.log(`✅ Sample documents from "${category}": ${sampleDocs.join(', ')}`);
      }
    }
    
    // Cek struktur dokumen
    const sampleDocId = Object.keys(docs)[0];
    if (sampleDocId) {
      const sampleDoc = docs[sampleDocId];
      console.log(`✅ Sample document structure check for "${sampleDocId}":`);
      console.log(`  - Title: ${sampleDoc.title}`);
      console.log(`  - Description: ${sampleDoc.description || 'N/A'}`);
      console.log(`  - Category: ${sampleDoc.category}`);
      console.log(`  - Subcategory: ${sampleDoc.subcategory || 'N/A'}`);
      console.log(`  - Tags: ${sampleDoc.tags.join(', ')}`);
      console.log(`  - Content length: ${sampleDoc.content.length} characters`);
    }
    
    console.log('\n✅ All tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run tests
(async () => {
  await testDocumentationLoading();
})(); 