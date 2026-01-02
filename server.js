// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoute from './router/auth-router.js';
import bookingRoute from './router/booking-routes.js';
import reviewRoutes from './router/review-router.js';
import messageRoutes from './router/message-router.js';

import connectDb from './utils/db.js';
import { setSocketInstance } from './utils/socket.js';
import { handleChatEvents } from './utils/message-handler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- CORS --------------------
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));

// -------------------- Middleware --------------------
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'utils/uploads')));

// -------------------- Routes --------------------
app.use('/api/auth', authRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// -------------------- Connect DB & Start Server --------------------
const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    console.log('✅ DB connection successful');

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      },
    });

    // Save io globally
    setSocketInstance(io);

    const connectedUsers = new Set();

    // ✅ Single connection listener
    io.on('connection', (socket) => {
      if (!connectedUsers.has(socket.id)) {
        connectedUsers.add(socket.id);
        console.log('🔌 User connected:', socket.id);
      }

      // Attach chat events for this socket
      handleChatEvents(socket, io);

      socket.on('disconnect', () => {
        if (connectedUsers.has(socket.id)) {
          connectedUsers.delete(socket.id);
          console.log('❌ User disconnected:', socket.id);
        }
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
  });
