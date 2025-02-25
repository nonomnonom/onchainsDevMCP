import path from 'path';
import { MdxDocument, loadDocumentationCollection } from './mdxReader';

// Type untuk document dalam dokumentasi
export interface Documentation {
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  subcategory?: string;
  path?: string;
  updatedAt?: Date;
}

// Menyiapkan path ke folder dokumentasi
const docsRootPath = path.join(process.cwd(), 'src', 'docs');

// Fungsi untuk mengubah MdxDocument menjadi Documentation
function convertToDocumentation(mdxDoc: MdxDocument): Documentation {
  return {
    title: mdxDoc.title,
    description: mdxDoc.description,
    content: mdxDoc.content,
    tags: mdxDoc.tags,
    category: mdxDoc.category,
    subcategory: mdxDoc.subcategory,
    path: mdxDoc.filepath,
    updatedAt: mdxDoc.createdAt
  };
}

// Variabel untuk menyimpan dokumentasi yang dimuat
let documentationsCache: Record<string, Documentation> = {};
let mdxDocsCache: Record<string, MdxDocument> = {};
let isLoaded = false;

// Fungsi untuk memuat dokumentasi
export async function loadDocumentations(): Promise<Record<string, Documentation>> {
  if (isLoaded) return documentationsCache;

  try {
    console.log(`Loading documentation from ${docsRootPath}...`);
    
    // Muat dokumentasi dari file MD/MDX
    mdxDocsCache = await loadDocumentationCollection(docsRootPath);
    
    // Konversi ke format Documentation
    for (const [id, mdxDoc] of Object.entries(mdxDocsCache)) {
      documentationsCache[id] = convertToDocumentation(mdxDoc);
    }
    
    isLoaded = true;
    console.log(`Loaded ${Object.keys(documentationsCache).length} documentation entries`);
    
    // Log beberapa contoh dokumentasi yang dimuat untuk validasi
    const examples = Object.keys(documentationsCache).slice(0, 5);
    console.log(`Sample document IDs: ${examples.join(', ')}`);
    
    return documentationsCache;
  } catch (error) {
    console.error('Error loading documentations:', error);
    // Kembalikan object kosong jika terjadi error
    documentationsCache = {};
    isLoaded = true;
    return documentationsCache;
  }
}

// Fungsi untuk mendapatkan dokumentasi
export async function getDocumentations(): Promise<Record<string, Documentation>> {
  if (!isLoaded) {
    return await loadDocumentations();
  }
  return documentationsCache;
}

// Fungsi untuk mendapatkan kategori
export async function getCategories(): Promise<string[]> {
  const docs = await getDocumentations();
  const categories = [...new Set(Object.values(docs).map(doc => doc.category))];
  return categories;
}

// Fungsi untuk mendapatkan subkategori
export async function getSubcategories(category: string): Promise<string[]> {
  const docs = await getDocumentations();
  const subcategories = [...new Set(
    Object.values(docs)
      .filter(doc => doc.category === category)
      .map(doc => doc.subcategory)
      .filter(Boolean) as string[]
  )];
  return subcategories;
}

// Dummy empty object for backward compatibility 
export const documentations: Record<string, Documentation> = {}; 