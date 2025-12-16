import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import User from '../models/user.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(req.file.buffer);

  await User.findByIdAndUpdate(req.user._id, {
    avatar: result.secure_url,
  });

  res.json({ url: result.secure_url });
};
