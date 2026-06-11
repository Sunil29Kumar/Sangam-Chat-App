import { SarvamAIClient } from "sarvamai";
import { Readable } from "stream";
import { sarvamSpeechToText } from "../services/sarvam.service.js";


export const speechToText = async (req, res) => {
    try {
        const audioFile = req.file;

        if (!audioFile) return res.status(400).json({ message: "No audio file uploaded", success: false });

        if (audioFile.size < 10 * 1024) return res.status(400).json({ message: "Validation failed: Audio stream is too short or silent.", success: false });

        const fileStream = new Readable();
        fileStream.push(audioFile.buffer);
        fileStream.push(null);

        Object.defineProperty(fileStream, 'path', {
            value: audioFile.originalname || 'audio.webm',
            writable: false
        });

        const response = await sarvamSpeechToText(fileStream);

        return res.status(200).json({
            success: true,
            transcript: response.transcript || response.text || ""
        });

    } catch (error) {
        // console.error("Server Error:", error.message);

        return res.status(500).json({
            message: "Internal server error ",
            success: false,
            // error: error.message
        });
    }
}