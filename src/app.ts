import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { userRoutes } from './routes/user-rotues';
import { pollRoutes } from './routes/poll-routes';

import { rateLimiter, requestLogger } from './middleware';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middleware/error-handler';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);

// Catch-all route for undefined endpoints
app.use('/{*any}', notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);
export { app };
