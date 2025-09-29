import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoute from './router/auth-router.js';
import bookingRoute from './router/booking-routes.js';
import reviewRoutes from './router/review-router.js';
import connectDb from './utils/db.js';
import { setSocketInstance } from './utils/socket.js';

const app = express();

// -------------------- CORS --------------------
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));

// -------------------- Middleware --------------------
app.use(express.json());

// -------------------- Routes --------------------
app.use('/api/auth', authRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/reviews', reviewRoutes);
// -------------------- Connect DB & Start Server --------------------
const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    console.log('DB connection successful');

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      },
    });

    setSocketInstance(io);

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
  });
