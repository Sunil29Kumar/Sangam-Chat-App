import { SarvamAIClient } from "sarvamai";
import fsPromises from "fs/promises"; // promises wale methods ke liye (jaise unlink)
import fs from "fs"; // 👈 Core fs module streams ke liye (createReadStream isme hota hai)

export const speechToText = async (req, res) => {
    try {
        const audioFile = req.file;
        // console.log("Uploaded File Context:", audioFile);

        if (!audioFile) {
            return res.status(400).json({ message: "No audio file uploaded", success: false });
        }

        const filePath = audioFile.path;

        // 1. Core 'fs' module se normal read stream banayein
        const fileStream = fs.createReadStream(filePath);

        // 2. Client initialize karein
        const client = new SarvamAIClient({
            apiSubscriptionKey: process.env.SARVAMAI_API_KEY,
        });

        
        const response = await client.speechToText.transcribe({
            file: fileStream,
            model: "saaras:v3",
            mode: "transcribe"
        });

        // console.log("Sarvam SDK Response:", response);

        await fsPromises.unlink(filePath);

        return res.status(200).json({
            success: true,
            transcript: response.transcript || response.text
        });

    } catch (error) {
        // console.error("Error in speechToText:", error.message);

        if (req.file && req.file.path) {
            try { await fsPromises.unlink(req.file.path); } catch (e) { }
        }

        return res.status(500).json({ message: "Internal server error", success: false });
    }
}