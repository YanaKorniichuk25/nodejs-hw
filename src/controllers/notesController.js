import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const filter = { userId: req.user._id };

    if (tag) filter.tag = tag;
    if (search) filter.$text = { $search: search };

    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const skip = (pageNum - 1) * perPageNum;

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPageNum),
    ]);

    res.status(200).json({
      page: pageNum,
      perPage: perPageNum,
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPageNum),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json({ note });
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json({ note });
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json({ note });
  } catch (err) {
    next(err);
  }
};
