import express from "express";
import noteRoutes from "./routes/note.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS middleware
app.use(cors());

app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/notes", noteRoutes);

app.use(errorHandler);

export default app;