import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import Database from "better-sqlite3";

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
  const PORT = 3008;

  app.use(express.json());

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Multer config
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

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

  app.post("/api/images", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { category, alt } = req.body;
    const url = `/uploads/${req.file.filename}`;
    
    const info = db.prepare("INSERT INTO images (url, category, alt) VALUES (?, ?, ?)").run(url, category || "general", alt || "");
    
    res.json({ id: info.lastInsertRowid, url, category, alt });
  });

  app.delete("/api/images/:id", (req, res) => {
    const { id } = req.params;
    const image = db.prepare("SELECT * FROM images WHERE id = ?").get(id) as any;
    if (image) {
      const filePath = path.join(process.cwd(), "public", image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      db.prepare("DELETE FROM images WHERE id = ?").run(id);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  });

  app.put("/api/images/:id", upload.single("image"), (req, res) => {
    const { id } = req.params;
    const { category, alt } = req.body;
    const existingImage = db.prepare("SELECT * FROM images WHERE id = ?").get(id) as any;

    if (!existingImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    let url = existingImage.url;
    if (req.file) {
      // Delete old file
      const oldFilePath = path.join(process.cwd(), "public", existingImage.url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      url = `/uploads/${req.file.filename}`;
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
