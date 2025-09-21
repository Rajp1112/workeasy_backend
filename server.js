import 'dotenv/config'; // loads .env automatically
import express from 'express';
import cors from 'cors';
import authRoute from './router/auth-router.js';
import bookingRoute from './router/booking-routes.js';
import connectDb from './utils/db.js';

const app = express();

// -------------------- CORS --------------------
const corsOptions = {
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));

// -------------------- Middleware --------------------
app.use(express.json()); 

// -------------------- Routes --------------------
app.use('/api/auth', authRoute);
app.use('/api/bookings', bookingRoute);
// app.use('/api/form', contactRoute);
// app.use('/api/data', serviceRoute);
// app.use('/api/admin', adminRoute);
// app.use('/api/movies', movieRoute);

// -------------------- Connect DB & Start Server --------------------
const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
