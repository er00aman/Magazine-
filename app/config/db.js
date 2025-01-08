import mongoose from 'mongoose';
import { DB_URL, DB_NAME } from '../utils/constant.js';

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}`);
        console.log(`\x1b[34m\x1b[1m
            🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
                                          \x1b[1m🚀🎉✅ Mongodb connected successfully.✅ 🎉🚀
            🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
            \x1b[0m
          `);
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDb;
