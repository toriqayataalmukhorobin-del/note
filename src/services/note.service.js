import pool from '../config/database.js';

export const findAllNotes = async () => {
    const [rows] = await pool.query('SELECT * FROM notes ORDER BY id DESC');
    return rows;
};

export const findNoteById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0] || null;
};

export const createNote = async (title) => {
    const [result] = await pool.query('INSERT INTO notes (title) VALUES (?)', [title]);
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    return rows[0];
};

export const updateNote = async (id, title) => {
    const [result] = await pool.query('UPDATE notes SET title = ? WHERE id = ?', [title, id]);
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0];
};

export const deleteNote = async (id) => {
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    await pool.query('DELETE FROM notes WHERE id = ?', [id]);
    return rows[0];
};