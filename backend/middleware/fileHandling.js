import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------- Storage (still needed temporarily before Cloudinary upload) -----------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/");
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + path.basename(file.originalname));
    }
});

// ----------- File Filter -----------
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

// ----------- Multer Instance -----------
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ----------- Upload Helpers -----------
export const uploadSingleFile = (fieldName) => upload.single(fieldName);

// ----------- DELETE LOCAL FILE (after Cloudinary upload) -----------
export const deleteUploadedFile = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (err) {
        console.error("Error deleting local file:", err);
    }
};