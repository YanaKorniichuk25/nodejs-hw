import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNum = Number(page);
    const perPageNum = Number(perPage);

    const filter = {};
    if (tag) {
      filter.tag = tag;
    }
    if (search !== undefined && search !== '') {
      // text search
      filter.$text = { $search: search };
    }

    const skip = (pageNum - 1) * perPageNum;

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPageNum),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalNotes / perPageNum));

    return res.status(200).json({
      page: pageNum,
      perPage: perPageNum,
      totalNotes,
      totalPages,
      notes,
    });
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
    return res.status(200).json({ note });
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const data = req.body;
    const note = await Note.create(data);
    return res.status(201).json({ note });
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
    return res.status(200).json({ note });
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
    return res.status(200).json({ note });
  } catch (err) {
    next(err);
  }
};
