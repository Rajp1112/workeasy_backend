require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoute = require('./router/auth-router');
const connectDb = require('./utils/db');

const app = express();

// -------------------- CORS --------------------
const corsOptions = {
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));

// -------------------- Middleware --------------------
app.use(express.json()); // parse JSON bodies

// -------------------- Routes --------------------
app.use('/api/auth', authRoute);

// You can enable these later when ready
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
