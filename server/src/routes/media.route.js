import express from "express";
import multer from "multer";
import { speechToText } from "../controllers/media.controller.js";
import { speechToTextMiddleware } from "../middleware/speech-to-text-Middleware.js";


const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 0.5 * 1024 * 1024, // 0.5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["audio/webm", "audio/wav", "audio/mpeg", "audio/ogg"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    }
});

router.post("/speech-to-text", upload.single("audio"), speechToTextMiddleware, speechToText);


export default router;