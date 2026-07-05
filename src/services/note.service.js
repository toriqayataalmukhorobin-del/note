import { db, saveDatabase } from '../config/database.js';

export const findAllNotes = async () => {
    const stmt = db.prepare('SELECT * FROM notes ORDER BY id DESC');
    const rows = stmt.getAsObject();
    stmt.free();
    return rows;
};

export const findNoteById = async (id) => {
    const stmt = db.prepare('SELECT * FROM notes WHERE id = :id');
    stmt.bind({ ':id': id });
    const row = stmt.getAsObject();
    stmt.free();
    return row || null;
};

export const createNote = async (title) => {
    const stmt = db.prepare('INSERT INTO notes (title) VALUES (:title)');
    stmt.run({ ':title': title });
    stmt.free();
    
    const insertId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    
    const selectStmt = db.prepare('SELECT * FROM notes WHERE id = :id');
    selectStmt.bind({ ':id': insertId });
    const row = selectStmt.getAsObject();
    selectStmt.free();
    
    saveDatabase();
    return row;
};

export const updateNote = async (id, title) => {
    const stmt = db.prepare('UPDATE notes SET title = :title WHERE id = :id');
    const result = stmt.run({ ':title': title, ':id': id });
    stmt.free();
    
    if (result === 0) return null;
    
    const selectStmt = db.prepare('SELECT * FROM notes WHERE id = :id');
    selectStmt.bind({ ':id': id });
    const row = selectStmt.getAsObject();
    selectStmt.free();
    
    saveDatabase();
    return row;
};

export const deleteNote = async (id) => {
    const selectStmt = db.prepare('SELECT * FROM notes WHERE id = :id');
    selectStmt.bind({ ':id': id });
    const row = selectStmt.getAsObject();
    selectStmt.free();
    
    if (!row || Object.keys(row).length === 0) return null;
    
    const deleteStmt = db.prepare('DELETE FROM notes WHERE id = :id');
    deleteStmt.run({ ':id': id });
    deleteStmt.free();
    
    saveDatabase();
    return row;
};