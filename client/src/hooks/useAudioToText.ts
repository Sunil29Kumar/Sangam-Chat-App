import {useState, useRef, useContext} from "react";
import {showToast} from "../utils/toast";
import {useChat} from "./useChat";
import {ChatContext} from "../context/ChatContext";

export const useAudioToText = ({setText}) => {
  const chatContext = useContext(ChatContext);
  const {convertSpeechToText} = useChat();
  // ─── SPEECH TO TEXT STATES ───
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  let recordingTimeout;

  if (!chatContext) return null;
  const {editedMessage, setEditedMessage} = chatContext;


  // ─── AUDIO RECORDING LOGIC (UPDATED & FIXED) ───
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, {mimeType});
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Sahi format ke sath binary blob taiyar karein
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        const {isValid, reason} = await validateAudio(audioBlob);

        if (!isValid) {
          showToast.info(reason || "Please try again or speak clearly.");
          return;
        }

        // 3. Agar valid hai, toh bindaas backend ko push karo
        // Loader chalu karein
        setIsProcessingAudio(true);

        try {
          // Backend API ko call karein
          const res = await convertSpeechToText(audioBlob);
          const parsedText = res?.text || res?.transcript;

          if (res && res.success && parsedText) {
            // Agar message edit mode mein hai toh edited content update karo, nahi toh normal text
            if (editedMessage.messageId) {
              setEditedMessage({
                ...editedMessage,
                content: editedMessage.content
                  ? editedMessage.content + " " + parsedText
                  : parsedText,
              });
            } else {
              setText((prev) => (prev ? prev + " " + parsedText : parsedText));
            }
          }
        } catch (apiError) {
          showToast.error(
            apiError?.message ||
              "Server communication failed. Please try again.",
          );
        } finally {
          setIsProcessingAudio(false);
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      // 10ms ke interval par data collection start karein taaki bits bypass na hon
      mediaRecorder.start(10);
      setIsRecording(true);

      const MAX_DURATION = 30000; // 30000 milliseconds = 30 seconds

      recordingTimeout = setTimeout(() => {
        // console.log("⏱️ 30 seconds complete! Auto-stopping recording...");
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop(); // Ye automatically 'onstop' event ko fire kar dega
          showToast.info(
            "⏰ Max limit 30 seconds ki hai, recording automatically stop ho gayi hai.",
          );
          stopRecording();
          playStopSound();
          setIsRecording(false);
        }
      }, MAX_DURATION);
    } catch (err) {
      showToast.error(
        err?.message || "Microphone access is required for voice input.",
      );
    }
  };

  // Blob ko decode karke check karega ki audio silent hai ya nahi
  const validateAudio = async (audioBlob) => {
    try {
      // 1. Blob ko ArrayBuffer mein convert karein
      const arrayBuffer = await audioBlob.arrayBuffer();

      // 2. AudioContext banayein taaki browser compressed data (WebM) ko decode kar sake
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      // 3. Raw PCM Data (AudioBuffer object) mein decode karein
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 4. Pehle channel (mono) ka raw floating-point amplitude data nikalen
      const rawChannelData = audioBuffer.getChannelData(0);

      let totalAmplitude = 0;

      // 5. Poori file ke amplitudes ka average (RMS) nikalein
      for (let i = 0; i < rawChannelData.length; i++) {
        totalAmplitude += Math.abs(rawChannelData[i]);
      }

      const averageVolume = totalAmplitude / rawChannelData.length;
      // console.log("🎤 Final Decoded Audio Average Volume:", averageVolume);

      // Cleanup context to free memory
      await audioContext.close();

      const SILENCE_THRESHOLD = 0.008;

      if (averageVolume < SILENCE_THRESHOLD) {
        stopRecording(); // Agar silent hai toh recording turant stop kar do
        setIsRecording(false);
        playStopSound(); // Stop sound play karo taaki user ko feedback mile
        return {isValid: false, reason: "Empty/Silent audio note"};
      }

      return {isValid: true};
    } catch (error) {
      return {isValid: true};
    }
  };

  const stopRecording = () => {
    if (recordingTimeout) clearTimeout(recordingTimeout);
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const playStartSound = () => {
    const audio = new Audio("./start.mp3");
    audio.volume = 0.4; // Volume thoda soft rakhein taaki kaan me na chubhe
    audio.play().catch((err) => console.log("Audio play blocked:", err));
  };

  const playStopSound = () => {
    const audio = new Audio("./start.mp3");
    audio.volume = 0.4;
    audio.play().catch((err) => console.log("Audio play blocked:", err));
  };

  const handleMicClick = () => {
    if (isRecording) {
      playStopSound();
      stopRecording();
    } else {
      playStartSound();
      startRecording();
    }
  };

  return {isRecording, isProcessingAudio, startRecording, stopRecording , handleMicClick};
};
