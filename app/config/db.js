import mongoose from 'mongoose';
import { DB_URL, DB_NAME } from '../utils/constant.js';

const connectDb = async () => {
    try {
        const connectionString = `${DB_URL}${DB_NAME}`;
        await mongoose.connect(connectionString);
        console.log("🚀✨ Database connected successfully! 🌟");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDb;
