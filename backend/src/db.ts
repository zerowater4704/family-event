import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("DB接続中");
  } catch (error) {
    console.log("DB接続エラー", error);
  }
};

export default connectDB;
