import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to DB during startup:', err);
  }

  const server = app.listen(PORT, () => {
    console.log(
      `\u{1F436} Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`
    );
  });

  /* ── Graceful shutdown ───────────────────────────────────────── */
  const shutdown = async (signal) => {
    console.log(`\n${signal} received – shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
      process.exit(0);
    });

    // Force exit after 10 s if connections won't drain
    setTimeout(() => {
      console.error('Forcing exit after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start();
