import express from "express";
import { 
    getNotes, 
    getNoteById, 
    createNewNote, 
    updateNoteById, 
    deleteNoteById 
} from "../controllers/note.controller.js";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNewNote);
router.put("/:id", updateNoteById);
router.delete("/:id", deleteNoteById);

export default router;