import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAMAI_API_KEY,
});


export const sarvamSpeechToText = async (fileStream) => {
    const response = await client.speechToText.transcribe({
        file: fileStream,
        model: "saaras:v3",
        mode: "transcribe"
    });
    return response;
}



