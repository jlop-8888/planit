import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to proxy Google Sheets submission
  app.post("/api/contact", async (req, res) => {
    const googleSheetUrl = process.env.GOOGLE_SHEET_URL;
    
    if (!googleSheetUrl) {
      console.error("Missing GOOGLE_SHEET_URL environment variable.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    try {
      // Use URLSearchParams to send data as application/x-www-form-urlencoded
      // This is the most compatible format for simple Google Apps Script 'doPost(e)'
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(req.body)) {
        params.append(key, String(value));
      }

      console.log(`Sending data to Google Sheets: ${googleSheetUrl}`);
      
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        body: params,
        redirect: "follow", // Ensure we follow Google's 302 redirects
      });

      const responseText = await response.text();
      console.log("Google Sheets Response Status:", response.status);
      
      if (response.ok) {
        res.json({ success: true });
      } else {
        console.error("Google Sheets Error Response:", responseText);
        res.status(response.status).json({ error: "Failed to save data" });
      }
    } catch (error) {
      console.error("Error sending to Google Sheets:", error);
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
