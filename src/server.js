// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});
