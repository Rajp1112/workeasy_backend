import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const uri =
      process.env.APP_ENV === "prod"
        ? process.env.MONGODB_PROD_URI
        : process.env.MONGODB_LOCAL_URI;

    await mongoose.connect(uri);
    console.log(`✅ DB connected (${process.env.APP_ENV})`);
  } catch (error) {
    console.error("❌ DB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDb;
