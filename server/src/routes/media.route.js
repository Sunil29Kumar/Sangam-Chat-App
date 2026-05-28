import express from "express";
import multer from "multer";
import { speechToText } from "../controllers/media.controller.js";

// const upload = multer({
//     dest: "uploads/",
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5 MB
//     },
// });


const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/speech-to-text", upload.single("audio"), speechToText);


export default router;