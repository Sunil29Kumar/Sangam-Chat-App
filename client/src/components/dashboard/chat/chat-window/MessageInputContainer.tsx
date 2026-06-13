import {ClosedCaption, Send, Smile, SpeechIcon} from "lucide-react";
import React, {useCallback, useContext, useState} from "react";
import {IoMdClose} from "react-icons/io";
import {ChatContext} from "../../../../context/ChatContext";
import {useChat} from "../../../../hooks/useChat";
import {useAudioToText} from "../../../../hooks/useAudioToText";
import dictionaryArray from "../../../../../contents//dictionaryArray.json";
import SuggestionBar from "./message-input-components/SuggestionBar";
import ReplyPreview from "./message-input-components/ReplyPreview";

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
  // Context and Hooks
  const chatContext = useContext(ChatContext);
  const {editMessage} = useChat();
  const {isRecording, isProcessingAudio, handleMicClick} = useAudioToText({
    setText,
  });

  // States
  const [suggestedMessageData, setSuggestedMessageData] = useState([]);

  if (!chatContext) return null;
  const {
    isReplyContainerOpen,
    setIsReplyContainerOpen,
    replyingData,
    editedMessage,
    setEditedMessage,
    setReplyingData,
  } = chatContext;

  // ── EDIT MESSAGE LOGIC ──
  const handleEditMessage = useCallback(async () => {
    if (!editedMessage.content.trim()) return;

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
  }, [editedMessage, setEditedMessage, setText, editMessage]);

  // suggestion message
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (editedMessage.messageId) {
      setEditedMessage({...editedMessage, content: val});
    }
    setText(val);
    handleTyping();

    if (val.trim() == "") {
      setSuggestedMessageData([]);
      return;
    }

    const word = val.split(" ");
    const lastWord = word[word.length - 1].toLowerCase();

    if (lastWord.length >= 2) {
      const matches = dictionaryArray
        .filter((item) => {
          return (
            item.toLowerCase().startsWith(lastWord) &&
            item.toLowerCase() !== lastWord
          );
        })
        .slice(0, 5);

      if (matches.length > 0) {
        setSuggestedMessageData(matches);
      } else {
        setSuggestedMessageData([]);
      }
    }

    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleSubmit = useCallback(() => {
    if (editedMessage.messageId) {
      handleEditMessage();
    } else {
      handleSendMessage();
      setSuggestedMessageData([]);
      setReplyingData({
        messageSender: {},
        replyToMessageId: "",
        replyToMessageText: "",
        conversationId: "",
      });
    }
  }, [
    editedMessage,
    handleEditMessage,
    handleSendMessage,
    setSuggestedMessageData,
    setReplyingData,
  ]);

  return (
    <div className=" py:0 px-3 md:py-1 shrink-0 min-w-0 w-full overflow-hidden mb-18 md:mb-0  ">
      {/* --- Message Input Container --- */}

      <div className=" bg-white py-2 px-3 rounded-[1.8rem] border-2 border-slate-50 flex flex-col gap-2 overflow-hidden flex-nowrap w-full shadow-sm ">
        {/* suggested message  */}
        <SuggestionBar
          suggestedMessageData={suggestedMessageData}
          text={text}
          editedMessage={editedMessage}
          setText={setText}
          setSuggestedMessageData={setSuggestedMessageData}
          setEditedMessage={setEditedMessage}
        />

        {/* reply container  */}
        <ReplyPreview
          isReplyContainerOpen={isReplyContainerOpen}
          replyingData={replyingData}
          scrollToReplayedMessage={scrollToReplayedMessage}
          setIsReplyContainerOpen={setIsReplyContainerOpen}
          setReplyingData={setReplyingData}
        />

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
              onChange={(e) => handleInputChange(e)}
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
            onClick={() => handleSubmit()}
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
