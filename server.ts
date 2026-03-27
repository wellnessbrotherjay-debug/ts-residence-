import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const db = new Database("database.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    alt TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3003;

  app.use(express.json());

  // Multer config - using memory storage for Supabase uploads
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // Map category to Supabase folder
  const getSupabaseFolder = (category: string) => {
    const mapping: Record<string, string> = {
      'soho': 'unit_soho',
      'solo': 'unit_solo',
      'studio': 'unit_studio',
      'apartments': 'unit_general', 
      'hero': 'front_house_images',
      'general': 'front_house_images',
      'contact': 'front_house_images',
      'offers': 'front_house_images',
    };
    // Default to front_house_images for everything else to keep it clean, 
    // or use the category name if you want more folders (but they must exist in Supabase)
    return mapping[category] || 'front_house_images';
  };

  // API Routes
  app.get("/api/images", (req, res) => {
    const category = req.query.category;
    let images;
    if (category) {
      images = db.prepare("SELECT * FROM images WHERE category = ? ORDER BY created_at DESC").all(category);
    } else {
      images = db.prepare("SELECT * FROM images ORDER BY created_at DESC").all();
    }
    res.json(images);
  });

  app.post("/api/images", upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { category, alt } = req.body;
    const folder = getSupabaseFolder(category || "general");
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
    const filePath = `${folder}/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from("as_per_unit")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("as_per_unit")
        .getPublicUrl(filePath);

      const info = db.prepare("INSERT INTO images (url, category, alt) VALUES (?, ?, ?)").run(publicUrl, category || "general", alt || "");

      res.json({ id: info.lastInsertRowid, url: publicUrl, category, alt });
    } catch (err: any) {
      console.error('Supabase upload error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/images/:id", async (req, res) => {
    const { id } = req.params;
    const image = db.prepare("SELECT * FROM images WHERE id = ?").get(id) as any;
    if (image) {
      // Try to extract path from Supabase URL
      // Expected URL: https://.../storage/v1/object/public/as_per_unit/folder/filename.ext
      const urlParts = image.url.split("/as_per_unit/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("as_per_unit").remove([filePath]);
      } else {
        // Fallback for local files if any exist
        const filePath = path.join(process.cwd(), "public", image.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      db.prepare("DELETE FROM images WHERE id = ?").run(id);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  });

  app.put("/api/images/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { category, alt } = req.body;
    const existingImage = db.prepare("SELECT * FROM images WHERE id = ?").get(id) as any;

    if (!existingImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    let url = existingImage.url;
    if (req.file) {
      // Delete old file from Supabase if applicable
      const oldUrlParts = existingImage.url.split("/as_per_unit/");
      if (oldUrlParts.length > 1) {
        await supabase.storage.from("as_per_unit").remove([oldUrlParts[1]]);
      }

      // Upload new file
      const folder = getSupabaseFolder(category || existingImage.category);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("as_per_unit")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("as_per_unit")
        .getPublicUrl(filePath);
      
      url = publicUrl;
    }

    db.prepare("UPDATE images SET url = ?, category = ?, alt = ? WHERE id = ?")
      .run(url, category || existingImage.category, alt !== undefined ? alt : existingImage.alt, id);

    res.json({ id, url, category, alt });
  });

  // Serve static files from public
  app.use(express.static("public"));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve build artifacts
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
