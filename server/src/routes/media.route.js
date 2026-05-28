import express from "express";
import multer from "multer";
import { speechToText } from "../controllers/media.controller.js";

// const upload = multer({
//     dest: "uploads/",
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5 MB
//     },
// });


const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
    dest: uploadDir,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB safety limit
});

const router = express.Router()

router.post("/speech-to-text", upload.single("audio"), speechToText);


export default router;