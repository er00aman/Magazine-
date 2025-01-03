import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../public/images/publisherAccount');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|jpeg|jpg|png/;
        const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                            allowedTypes.test(file.mimetype);

        if (isValidType) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF or image files (JPEG, JPG, PNG) are allowed.'));
        }
    }
});

export default upload;
