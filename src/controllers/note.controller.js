import {
    findAllNotes,
    findNoteById,
    createNote,
    updateNote,
    deleteNote
} from "../services/note.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateNote } from "../validators/note.validator.js";

export const getNotes = async (req, res) => {
    const notes = await findAllNotes();

    successResponse(res, notes);
};

export const getNoteById = async (req, res) => {
    const id = Number(req.params.id);
    const note = await findNoteById(id);

    if (!note) {
        return res.status(404).json({
            message: "Catatan tidak ditemukan"
        });
    }

    res.json(note);
};

export const createNewNote = async (req, res) => {
    const { title } = req.body;

    const validation = validateNote(title);
    if (!validation.valid) {
        return errorResponse(res, validation.message, 400);
    }

    const note = await createNote(title);

    successResponse(res, note, "Catatan berhasil ditambahkan", 201);
};

export const updateNoteById = async (req, res) => {
    const id = Number(req.params.id);
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Title wajib diisi"
        });
    }

    const note = await updateNote(id, title);

    if (!note) {
        return errorResponse(res, "Catatan tidak ditemukan", 404);
    }

    successResponse(res, note, "Catatan berhasil diupdate");
};

export const deleteNoteById = async (req, res) => {
    const id = Number(req.params.id);

    const note = await deleteNote(id);

    if (!note) {
        return res.status(404).json({
            message: "Catatan tidak ditemukan"
        });
    }

    res.json({
        message: "Catatan berhasil dihapus",
        data: note
    });
};