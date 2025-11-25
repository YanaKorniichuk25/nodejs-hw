import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    return res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    return res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const data = req.body;
    const note = await Note.create(data);
    return res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    return res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const data = req.body;
    const note = await Note.findByIdAndUpdate(noteId, data, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    return res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
