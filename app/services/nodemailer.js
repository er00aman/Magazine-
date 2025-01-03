import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; 

dotenv.config();  

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,  
        pass: process.env.EMAIL_PASSWORD,  
    },
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,  
});

export default transporter;
