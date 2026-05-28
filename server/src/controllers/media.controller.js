import { SarvamAIClient } from "sarvamai";
import { Readable } from "stream";

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAMAI_API_KEY,
});

export const speechToText = async (req, res) => {
    try {
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).json({ message: "No audio file uploaded", success: false });
        }

        const fileStream = new Readable();
        fileStream.push(audioFile.buffer);
        fileStream.push(null);

        Object.defineProperty(fileStream, 'path', {
            value: audioFile.originalname || 'audio.webm',
            writable: false
        });

        // console.log("Transcribing memory stream via Sarvam SDK...");

        const response = await client.speechToText.transcribe({
            file: fileStream,
            model: "saaras:v3",
            mode: "transcribe"
        });

        // console.log("Sarvam SDK Core Execution Success:", response);

        return res.status(200).json({
            success: true,
            transcript: response.transcript || response.text || ""
        });

    } catch (error) {
        console.error("Critical Error inside Sarvam SDK pipeline:", error.message);

        return res.status(500).json({
            message: "Internal server error during transcription pipeline",
            success: false,
            error: error.message
        });
    }
}