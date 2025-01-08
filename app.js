import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDb from './app/config/db.js';
import cors from 'cors';
import indexRouter from './app/routes/index.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin:'*'}));

// Connect to the database
connectDb();

// Serve static files (Added this line for public folder)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes (No changes here)
app.use('/apis', indexRouter);

app.get("/",(req,res)=>{
    res.json({
        message:"Server is running at 8000"
    })
})

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀✨ Server is running on port ${PORT} 🌟`);
    console.log(`✅ Loaded PORT from .env: ${process.env.PORT ? 'Yes' : 'No'}`);
});
