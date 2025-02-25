import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { z } from "zod";
import { documentations, getDocumentations, loadDocumentations, getCategories, getSubcategories } from "./docs/index.js";

// Create MCP server instance
const server = new McpServer({
  name: "Documentation Server",
  version: "1.0.0"
});

// Muat dokumentasi saat startup
let docsLoaded = false;
async function initDocumentation() {
  if (!docsLoaded) {
    await loadDocumentations();
    docsLoaded = true;
    console.log('Documentation loaded successfully');
  }
}

// Add a documentation resource for dynamic docs
server.resource(
  "docs-dynamic",
  new ResourceTemplate("docs://{topic}", { list: undefined }),
  async (uri, { topic }) => {
    const topicKey = Array.isArray(topic) ? topic[0] : topic;
    
    // Load documentation if not loaded
    const docs = await getDocumentations();
    
    // Coba cari dokumen yang cocok
    const doc = docs[topicKey];
    if (!doc) {
      return {
        contents: [{
          uri: uri.href,
          text: `Documentation not found for ${topicKey}`
        }]
      };
    }
    
    // Format konten dengan metadata
    const metadata = [
      `Category: ${doc.category}`,
      doc.subcategory ? `Subcategory: ${doc.subcategory}` : '',
      `Tags: ${doc.tags.join(', ')}`,
      doc.updatedAt ? `Last Updated: ${doc.updatedAt.toLocaleDateString()}` : ''
    ].filter(Boolean).join(' | ');
    
    return {
      contents: [{
        uri: uri.href,
        text: `# ${doc.title}\n\n${doc.description ? `> ${doc.description}\n\n` : ''}${metadata}\n\n${doc.content}`
      }]
    };
  }
);

// Add a specific resource for categories
server.resource(
  "docs-category",
  new ResourceTemplate("docs-category://{category}", { list: undefined }),
  async (uri, { category }) => {
    const categoryName = Array.isArray(category) ? category[0] : category;
    
    // Load documentation if not loaded
    const docs = await getDocumentations();
    
    // Get subcategories for this category
    const subcategories = await getSubcategories(categoryName);
    
    // Filter docs by category
    const categoryDocs = Object.entries(docs)
      .filter(([_, doc]) => doc.category === categoryName)
      .map(([id, doc]) => ({
        id,
        title: doc.title,
        description: doc.description,
        subcategory: doc.subcategory,
        preview: doc.content.slice(0, 100).replace(/\n/g, ' ') + "..."
      }));
    
    if (categoryDocs.length === 0) {
      return {
        contents: [{
          uri: uri.href,
          text: `No documentation found for category: ${categoryName}`
        }]
      };
    }
    
    // Group by subcategory
    const docsBySubcategory: Record<string, typeof categoryDocs> = {};
    
    // Add "root" subcategory for docs without subcategory
    docsBySubcategory['root'] = categoryDocs.filter(doc => !doc.subcategory);
    
    // Group other docs by subcategory
    subcategories.forEach(subcat => {
      docsBySubcategory[subcat] = categoryDocs.filter(doc => doc.subcategory === subcat);
    });
    
    // Build content
    let content = `# ${categoryName} Documentation\n\n`;
    
    // Add subcategory navigation
    if (subcategories.length > 0) {
      content += `## Subcategories\n\n`;
      subcategories.forEach(subcat => {
        content += `- [${subcat}](#${subcat.toLowerCase().replace(/\s+/g, '-')})\n`;
      });
      content += `\n`;
    }
    
    // Add root docs first if any
    if (docsBySubcategory['root'] && docsBySubcategory['root'].length > 0) {
      content += `## Main Documents\n\n`;
      docsBySubcategory['root'].forEach(doc => {
        content += `### ${doc.title}\n${doc.description ? `> ${doc.description}\n\n` : ''}${doc.preview}\n\nAccess full document: docs://${doc.id}\n\n`;
      });
    }
    
    // Add docs by subcategory
    subcategories.forEach(subcat => {
      if (docsBySubcategory[subcat] && docsBySubcategory[subcat].length > 0) {
        content += `## ${subcat}\n\n`;
        docsBySubcategory[subcat].forEach(doc => {
          content += `### ${doc.title}\n${doc.description ? `> ${doc.description}\n\n` : ''}${doc.preview}\n\nAccess full document: docs://${doc.id}\n\n`;
        });
      }
    });
    
    return {
      contents: [{
        uri: uri.href,
        text: content
      }]
    };
  }
);

// Add a subcategory resource
server.resource(
  "docs-subcategory",
  new ResourceTemplate("docs-subcategory://{category}/{subcategory}", { list: undefined }),
  async (uri, { category, subcategory }) => {
    const categoryName = Array.isArray(category) ? category[0] : category;
    const subcategoryName = Array.isArray(subcategory) ? subcategory[0] : subcategory;
    
    // Load documentation if not loaded
    const docs = await getDocumentations();
    
    // Filter docs by category and subcategory
    const filteredDocs = Object.entries(docs)
      .filter(([_, doc]) => doc.category === categoryName && doc.subcategory === subcategoryName)
      .map(([id, doc]) => ({
        id,
        title: doc.title,
        description: doc.description,
        preview: doc.content.slice(0, 100).replace(/\n/g, ' ') + "..."
      }));
    
    if (filteredDocs.length === 0) {
      return {
        contents: [{
          uri: uri.href,
          text: `No documentation found for subcategory: ${subcategoryName} in category: ${categoryName}`
        }]
      };
    }
    
    return {
      contents: [{
        uri: uri.href,
        text: `# ${categoryName} / ${subcategoryName}\n\n${filteredDocs.map(doc => 
          `## ${doc.title}\n${doc.description ? `> ${doc.description}\n\n` : ''}${doc.preview}\n\nAccess full document: docs://${doc.id}`
        ).join('\n\n')}`
      }]
    };
  }
);

// Add a search tool
server.tool(
  "search-docs",
  { query: z.string() },
  async ({ query }) => {
    // Load documentation if not loaded
    const docs = await getDocumentations();
    
    const results = Object.entries(docs)
      .filter(([_, doc]) => {
        const searchText = `${doc.title} ${doc.description || ''} ${doc.content} ${doc.tags.join(" ")}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
      .map(([id, doc]) => ({
        id,
        title: doc.title,
        description: doc.description,
        preview: doc.content.slice(0, 100).replace(/\n/g, ' ') + "...",
        category: doc.category,
        subcategory: doc.subcategory
      }));

    return {
      content: [{
        type: "text",
        text: results.length > 0
          ? `Found ${results.length} results for "${query}":\n\n${results.map(r => 
              `- ${r.title} [${r.category}${r.subcategory ? ` / ${r.subcategory}` : ''}]\n  ${r.description ? `${r.description}\n  ` : ''}${r.preview}\n  Access with: docs://${r.id}`
            ).join("\n\n")}`
          : `No results found for "${query}".`
      }]
    };
  }
);

// Add a list topics tool
server.tool(
  "list-topics",
  {},
  async () => {
    // Load documentation if not loaded
    const docs = await getDocumentations();
    
    // Get all categories
    const categories = await getCategories();
    
    // Build a summary of documentation by category
    const summary = await Promise.all(categories.map(async category => {
      const subcategories = await getSubcategories(category);
      const count = Object.values(docs).filter(doc => doc.category === category).length;
      
      return {
        category,
        subcategories,
        count
      };
    }));
    
    return {
      content: [{
        type: "text",
        text: `# Documentation Overview\n\nTotal documents: ${Object.keys(docs).length}\n\n` +
          summary.map(s => 
            `## ${s.category} (${s.count} documents)\n` +
            `Access category: docs-category://${s.category}\n\n` +
            (s.subcategories.length > 0 
              ? `Subcategories:\n${s.subcategories.map(sub => 
                  `- ${sub} (Access: docs-subcategory://${s.category}/${sub})`
                ).join('\n')}\n`
              : 'No subcategories.')
          ).join('\n\n')
      }]
    };
  }
);

// Add a list categories tool
server.tool(
  "list-categories",
  {},
  async () => {
    // Get all categories
    const categories = await getCategories();
    
    return {
      content: [{
        type: "text",
        text: categories.length > 0
          ? `Available documentation categories:\n\n${categories.map(cat => 
              `- ${cat}\n  Access with: docs-category://${cat}`
            ).join("\n\n")}`
          : "No categories found."
      }]
    };
  }
);

// Add a compare tool to compare documentation between categories
server.tool(
  "compare-docs",
  { 
    topic1: z.string().describe("First topic ID or keyword"),
    topic2: z.string().describe("Second topic ID or keyword")
  },
  async ({ topic1, topic2 }) => {
    // Load documentation if not loaded
    const docs = await getDocumentations();
    
    // Helper function to find a document by ID or search
    const findDoc = (query: string) => {
      // Direct match by ID
      if (docs[query]) return { id: query, ...docs[query] };
      
      // Search in titles and content
      const results = Object.entries(docs)
        .filter(([_, doc]) => {
          const searchText = `${doc.title} ${doc.description || ''} ${doc.content}`.toLowerCase();
          return searchText.includes(query.toLowerCase());
        })
        .map(([id, doc]) => ({ id, ...doc }));
      
      return results.length > 0 ? results[0] : null;
    };
    
    const doc1 = findDoc(topic1);
    const doc2 = findDoc(topic2);
    
    if (!doc1 && !doc2) {
      return {
        content: [{
          type: "text",
          text: `Could not find documentation for either "${topic1}" or "${topic2}".`
        }]
      };
    }
    
    if (!doc1) {
      return {
        content: [{
          type: "text",
          text: `Could not find documentation for "${topic1}".`
        }]
      };
    }
    
    if (!doc2) {
      return {
        content: [{
          type: "text",
          text: `Could not find documentation for "${topic2}".`
        }]
      };
    }
    
    // Compare the documents
    return {
      content: [{
        type: "text",
        text: `# Comparison: ${doc1.title} vs ${doc2.title}\n\n` +
          `## ${doc1.title} [${doc1.category}${doc1.subcategory ? ` / ${doc1.subcategory}` : ''}]\n` +
          `${doc1.description ? `> ${doc1.description}\n\n` : ''}` +
          `Access with: docs://${doc1.id}\n\n` +
          `## ${doc2.title} [${doc2.category}${doc2.subcategory ? ` / ${doc2.subcategory}` : ''}]\n` +
          `${doc2.description ? `> ${doc2.description}\n\n` : ''}` +
          `Access with: docs://${doc2.id}\n\n` +
          `## Common Tags\n` +
          `${doc1.tags.filter(tag => doc2.tags.includes(tag)).join(', ') || 'No common tags.'}`
      }]
    };
  }
);

// Setup Express server
const app = express();
app.use(express.json());

// Handle SSE connections
app.get("/sse", async (req, res) => {
  // Ensure documentation is loaded
  await initDocumentation();
  
  const transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

// Handle incoming messages
app.post("/messages", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  await transport.handlePostMessage(req, res);
});

// Start server
const PORT = 1234;
app.listen(PORT, async () => {
  // Preload documentation at startup
  await initDocumentation();
  console.log(`MCP Documentation Server running on port ${PORT}`);
}); 