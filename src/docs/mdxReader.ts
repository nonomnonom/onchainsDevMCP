import { promises as fs } from 'fs';
import path from 'path';

export interface MdxDocument {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  subcategory?: string;
  filepath: string;
  tags: string[];
  createdAt: Date;
}

// Ekstrak judul dari konten MD/MDX
function extractTitle(content: string): { title: string; description: string } {
  // Cari pola judul dengan format: # Title [Description]
  const titleMatch = content.match(/^#\s+(.*?)(\s+\[(.*?)\])?$/m);
  
  if (titleMatch) {
    const title = titleMatch[1].trim();
    const description = titleMatch[3] ? titleMatch[3].trim() : '';
    return { title, description };
  }
  
  // Format alternatif tanpa deskripsi dalam bracket
  const simpleTitleMatch = content.match(/^#\s+(.*)$/m);
  if (simpleTitleMatch) {
    return { 
      title: simpleTitleMatch[1].trim(),
      description: ''
    };
  }
  
  return { title: 'Untitled Document', description: '' };
}

// Membaca file MD/MDX dan mengubahnya ke format MdxDocument
export async function readMdxFile(filepath: string, category: string, subcategory?: string): Promise<MdxDocument> {
  const content = await fs.readFile(filepath, 'utf-8');
  const filename = path.basename(filepath, path.extname(filepath));
  const fileStats = await fs.stat(filepath);
  
  // Ekstrak informasi
  const { title, description } = extractTitle(content);
  
  // Ekstrak tags berdasarkan kategori, subcategory, dan nama file
  const tags = [category];
  if (subcategory) tags.push(subcategory);
  
  // Tambahkan nama file sebagai tag
  tags.push(filename);
  
  // Tambahkan kata-kata dari nama file sebagai tag
  if (filename.includes('-')) {
    tags.push(...filename.split('-'));
  }
  
  // Tambahkan kata-kata dalam judul sebagai tag
  const titleWords = title.toLowerCase().split(/\s+/);
  tags.push(...titleWords.filter(word => word.length > 3));
  
  // Buat ID yang menunjukkan hirarki penuh
  const idParts = [category];
  if (subcategory) idParts.push(subcategory);
  idParts.push(filename);
  const id = idParts.join('/');
  
  return {
    id,
    title,
    description,
    content,
    category,
    subcategory,
    filepath,
    tags: [...new Set(tags)], // Remove duplicates
    createdAt: fileStats.mtime
  };
}

// Membaca semua file MD/MDX dari directory dan sub-directory
export async function indexMdxDocuments(basePath: string, category: string): Promise<MdxDocument[]> {
  const docs: MdxDocument[] = [];
  
  // Fungsi rekursif untuk membaca file dari directory
  async function readDirectory(dirPath: string, subCategory?: string): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Gunakan nama directory sebagai subkategori
        await readDirectory(fullPath, entry.name);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        // Baca file MD/MDX
        const doc = await readMdxFile(fullPath, category, subCategory);
        docs.push(doc);
      }
    }
  }
  
  try {
    await readDirectory(basePath);
  } catch (error) {
    console.error(`Error indexing documents in ${basePath}:`, error);
  }
  
  return docs;
}

// Load documentation collection
export async function loadDocumentationCollection(docsRoot: string): Promise<Record<string, MdxDocument>> {
  try {
    const entries = await fs.readdir(docsRoot, { withFileTypes: true });
    const allDocs: Record<string, MdxDocument> = {};
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const category = entry.name; // Category name = directory name
        const categoryPath = path.join(docsRoot, category);
        const docs = await indexMdxDocuments(categoryPath, category);
        
        // Add docs to collection
        for (const doc of docs) {
          allDocs[doc.id] = doc;
        }
        
        console.log(`Indexed ${docs.length} documents for category "${category}"`);
      }
    }
    
    return allDocs;
  } catch (error) {
    console.error(`Error loading documentation collection:`, error);
    return {};
  }
} 