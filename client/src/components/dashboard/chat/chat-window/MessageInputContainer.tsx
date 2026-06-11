import {
  ClosedCaption,
  CrossIcon,
  Send,
  Smile,
  Speech,
  SpeechIcon,
} from "lucide-react";
import React, {useContext, useEffect, useRef, useState} from "react";
import {IoMdClose} from "react-icons/io";
import {ChatContext} from "../../../../context/ChatContext";
import {useChat} from "../../../../hooks/useChat";
import {showToast} from "../../../../utils/toast";

function MessageInputContainer({
  text,
  setText,
  handleSendMessage,
  handleTyping,
  scrollToReplayedMessage,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleTyping: () => void;
  scrollToReplayedMessage: (messageId: string) => void;
}) {
  const chatContext = useContext(ChatContext);
  const {editMessage, convertSpeechToText} = useChat();
  if (!chatContext) return null;
  const {
    isReplyContainerOpen,
    setIsReplyContainerOpen,
    replyingData,
    editedMessage,
    setEditedMessage,
    setReplyingData,
  } = chatContext;

  // ─── SPEECH TO TEXT STATES ───
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  let recordingTimeout;

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
          showToast.error(reason || "Please try again or speak clearly.");
          return;
        }

        // 3. Agar valid hai, toh bindaas backend ko push karo
        // console.log("✅ Audio valid hai, sending to Sarvam AI via backend...");

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
          } else {
            showToast.error(res?.message || "Please try again.");
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
        console.log("⏱️ 30 seconds complete! Auto-stopping recording...");
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop(); // Ye automatically 'onstop' event ko fire kar dega
          // alert(
          //   "⏰ Max limit 30 seconds ki hai, recording automatically stop ho gayi hai.",
          // );
          // stopRecording();
          // setIsRecording(false);
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
      // console.error("Audio validation failed:", error.message);
      // Agar kisi wajah se browser decode na kar paye, toh safe side rehne ke liye true bhej do
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

  const handleEditMessage = async () => {
    if (!editedMessage.content.trim()) return;
    console.log("em 2", editedMessage.content);

    const response = await editMessage(
      editedMessage.conversationId,
      editedMessage.messageId,
      editedMessage.content,
    );

    if (response.success) {
      // Reset Everything
      setEditedMessage({content: "", messageId: "", conversationId: ""});
      setText(""); // normal text ko bhi clear kar do safe side ke liye
    }
  };

  return (
    <div className=" py:0 px-3 md:py-1 shrink-0 min-w-0 w-full overflow-hidden mb-18 md:mb-0  ">
      {/* --- Message Input Container --- */}

      <div className=" bg-white py-2 px-3 rounded-[1.8rem] border-2 border-slate-50 flex flex-col gap-2 overflow-hidden flex-nowrap w-full shadow-sm ">
        {/* reply container  */}
        {isReplyContainerOpen && (
          <div className=" flex justify-between px-3 py-2 bg-gray-100 rounded-md ">
            <p>
              <span>{replyingData?.messageSender?.name || "You"}</span>
              <h3
                onClick={() =>
                  scrollToReplayedMessage(replyingData.replyToMessageId)
                }
                className=" cursor-pointer bg-blue-100 w-full p-2 rounded-md  "
              >
                {replyingData?.replyToMessageText.length > 50
                  ? replyingData?.replyToMessageText.substring(0, 50) + "..."
                  : replyingData?.replyToMessageText}
              </h3>
            </p>
            <IoMdClose
              onClick={() => {
                setIsReplyContainerOpen(false);
                setReplyingData({
                  messageSender: {},
                  replyToMessageId: "",
                  replyToMessageText: "",
                  conversationId: "",
                });
              }}
              className=" cursor-pointer "
            />
          </div>
        )}

        {/* input container  */}
        <div className=" flex items-center gap-3  ">
          {/* react  */}
          <button className="text-slate-400 hover:text-indigo-500 p-2 transition-colors">
            <Smile size={22} />
          </button>
          {editedMessage.messageId && (
            <div
              onClick={() => scrollToReplayedMessage(editedMessage.messageId)}
              className="flex justify-between items-center gap-3 pl-3 pr-2 py-2 bg-indigo-50/80 backdrop-blur-sm border-l-4 border-indigo-500 cursor-pointer rounded-r-md transition-all hover:bg-indigo-100 group mb-1"
            >
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
                    Editing Message
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate leading-tight mt-0.5">
                  {editedMessage.content.slice(0, 10) + "..." || "..."}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // 👈 Sabse important: Taki scroll trigger na ho
                  setEditedMessage({
                    content: "",
                    messageId: "",
                    conversationId: "",
                  });
                }}
                className="p-1.5 hover:bg-indigo-200 rounded-full text-indigo-400 hover:text-indigo-600 transition-colors"
              >
                <IoMdClose size={18} />
              </button>
            </div>
          )}
          {/* input  */}
          {isRecording ? (
            /* ─── RECORDING STATE ANIMATION WAVE ─── */
            <div className="flex-1 flex items-center justify-between px-2 py-2 bg-indigo-50/50 rounded-lg animate-pulse select-none">
              <div className="flex items-center gap-3">
                {/* Red Blinking Pulse Indicator */}
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>

                {/* Animated Audio Waves */}
                <div className="flex items-end gap-[3px] h-4">
                  <div
                    className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_100ms]"
                    style={{height: "60%"}}
                  ></div>
                  <div
                    className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_300ms]"
                    style={{height: "100%"}}
                  ></div>
                  <div
                    className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_200ms]"
                    style={{height: "40%"}}
                  ></div>
                  <div
                    className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_400ms]"
                    style={{height: "80%"}}
                  ></div>
                  <div
                    className="w-[3px] bg-indigo-500 rounded-full animate-[bounce_0.8s_infinite_150ms]"
                    style={{height: "50%"}}
                  ></div>
                </div>

                <span className="text-[14px] font-medium text-indigo-600 tracking-wide animate-pulse">
                  Recording audio via Sarvam AI...
                </span>
              </div>
            </div>
          ) : (
            /* ─── STANDARD CHAT INPUT ELEMENT ─── */
            <input
              type="text"
              value={editedMessage.messageId ? editedMessage.content : text}
              onChange={(e) => {
                const val = e.target.value;
                if (editedMessage.messageId) {
                  setEditedMessage({...editedMessage, content: val});
                } else {
                  setText(val);
                }
                handleTyping();
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (editedMessage.messageId) {
                    handleEditMessage(); // Ensure this method is defined/imported properly
                  } else {
                    handleSendMessage();
                    setReplyingData({
                      messageSender: {},
                      replyToMessageId: "",
                      replyToMessageText: "",
                      conversationId: "",
                    });
                  }
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] font-semibold text-slate-700 py-2.5 placeholder:text-slate-400"
              style={{
                wordBreak: "break-all",
                overflowWrap: "anywhere",
              }}
            />
          )}

          {/* --------------- submit ---------  */}
          <button
            onClick={() => {
              if (editedMessage.messageId) {
                handleEditMessage();
              } else {
                handleSendMessage();
                setReplyingData({
                  messageSender: {},
                  replyToMessageId: "",
                  replyToMessageText: "",
                  conversationId: "",
                });
              }
            }}
            disabled={!text.trim() && !editedMessage.content.trim()}
            className={`w-10 h-10  md:w-10 md:h-11 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-90 ${
              text.trim() || editedMessage.content.trim()
                ? "md:bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                : "md:bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Send
              size={18}
              fill={text.trim() ? "currentColor" : "none"}
              className={text.trim() ? "ml-0.5" : ""}
            />
          </button>

          {/* --------------- microphone ---------  */}
          {/* ─── MICROPHONE / STT ACTION BUTTON ─── */}
          <button
            onClick={handleMicClick}
            disabled={isProcessingAudio}
            className={`p-2 rounded-full transition-all duration-300 relative flex items-center justify-center ${
              isRecording
                ? "bg-rose-500 text-white shadow-md shadow-rose-200 scale-105 hover:bg-rose-600"
                : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100/80 active:scale-95"
            } ${isProcessingAudio ? "opacity-60 cursor-not-allowed" : ""}`}
            title={
              isProcessingAudio
                ? "Processing speech via Sarvam AI..."
                : isRecording
                  ? "Click to Stop & Transcribe"
                  : "Speak (Sarvam AI)"
            }
          >
            {isProcessingAudio ? (
              // Clean loading spinner matching the container theme
              <div className="w-[22px] h-[22px] border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            ) : isRecording ? (
              // Jab recording ho rahi ho, toh explicit 'Stop' symbol dikhao
              <div className="relative flex items-center justify-center w-[23px] h-[23px]">
                <div className="w-3 h-3 bg-white rounded-[2px] animate-scale"></div>
                {/* Lucide ka 'Square' icon bhi use kar sakte ho wrapper hata kar, like: <Square size={16} className="fill-white" /> */}
              </div>
            ) : (
              // Default Idle State Icon
              <SpeechIcon
                size={23}
                className="transition-transform duration-200 hover:rotate-12"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageInputContainer;
