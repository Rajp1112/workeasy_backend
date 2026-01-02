import mongoose from 'mongoose';

const URI = 'mongodb://127.0.0.1:27017/workeasy';
// mongoose.connect(URI);
// const URI = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connection Successful to DB');
  } catch (error) {
    console.error('database connection failed');
    process.exit(0);
  }
};

export default connectDb;
