import {ClosedCaption, CrossIcon, Send, Smile} from "lucide-react";
import React, {useContext} from "react";
import {IoMdClose} from "react-icons/io";
import {ChatContext} from "../../../../context/ChatContext";
import {useChat} from "../../../../hooks/useChat";

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
  const {editMessage} = useChat();
  if (!chatContext) return null;
  const {
    isReplyContainerOpen,
    setIsReplyContainerOpen,
    replyingData,
    editedMessage,
    setEditedMessage,
    setReplyingData
  } = chatContext;

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
                  handleEditMessage();
                } else {
                  handleSendMessage();
                }
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] font-semibold text-slate-700 py-2.5 placeholder:text-slate-400"
            style={{
              wordBreak: "break-all", // 'sssss' ko todne ke liye
              overflowWrap: "anywhere",
            }}
          />

          {/* submit   */}
          <button
            onClick={() => {
              if (editedMessage.messageId) {
                handleEditMessage();
              } else {
                handleSendMessage();
              }
            }}
            disabled={!text.trim() && !editedMessage.content.trim()}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-90 ${
              text.trim() || editedMessage.content.trim()
                ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Send
              size={18}
              fill={text.trim() ? "currentColor" : "none"}
              className={text.trim() ? "ml-0.5" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageInputContainer;
