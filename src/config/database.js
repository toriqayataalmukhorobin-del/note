import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;
const dbPath = path.join(__dirname, '../../notes.db');

// Initialize SQLite database
const initDatabase = async () => {
    try {
        const SQL = await initSqlJs();
        
        // Load existing database or create new one
        let dbData;
        if (fs.existsSync(dbPath)) {
            dbData = fs.readFileSync(dbPath);
            db = new SQL.Database(dbData);
            console.log('✅ Database loaded from file');
        } else {
            db = new SQL.Database();
            // Create table
            db.run(`
                CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            // Insert dummy data
            db.run("INSERT INTO notes (title) VALUES ('Belajar Express')");
            db.run("INSERT INTO notes (title) VALUES ('Belajar Node.js')");
            
            // Save to file
            saveDatabase();
            console.log('✅ Database created with dummy data');
        }
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
    }
};

// Save database to file
const saveDatabase = () => {
    try {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    } catch (error) {
        console.error('❌ Failed to save database:', error.message);
    }
};

// Initialize database
await initDatabase();

export { db, saveDatabase };
