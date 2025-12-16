import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import authRouter from './routes/authRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import userRouter from './routes/userRoutes.js';
import logger from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

const start = async () => {
  try {
    await connectMongoDB(process.env.MONGO_URL);

    app.use(logger);
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json());
    app.use(cookieParser());

    app.use(authRouter);
    app.use(notesRouter);
    app.use(userRouter);

    app.use(notFoundHandler);
    app.use(celebrateErrors());
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
