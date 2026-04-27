import {ClosedCaption, CrossIcon, Send, Smile} from "lucide-react";
import React, {useContext} from "react";
import {IoMdClose} from "react-icons/io";
import {ChatContext} from "../../../../context/ChatContext";

function MessageInputContainer({
  text,
  setText,
  handleSendMessage,
  handleTyping,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleTyping: () => void;
}) {
  const chatContext = useContext(ChatContext);
  if (!chatContext) return null;
  const {isReplyContainerOpen, setIsReplyContainerOpen ,replyingData} = chatContext;

  return (
    <div className=" px-3 py-3 flex-shrink-0  ">
      {/* --- Message Input Container --- */}

      <div className=" bg-white py-2 px-3 rounded-[1.8rem] border-2 border-slate-50 flex flex-col gap-2 ">
        {/* reply container  */}
        {isReplyContainerOpen && (
          <div className=" flex justify-between px-3 py-2 bg-gray-100 rounded-md ">
            <p>
              <span>{replyingData?.messageSender?.name || "You"}</span>
              <h3>{replyingData?.replyToMessageText.length > 150 ? replyingData?.replyToMessageText.substring(0, 150) + "..." : replyingData?.replyToMessageText}</h3>
            </p>
            <IoMdClose
              onClick={() => setIsReplyContainerOpen(false)}
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

          {/* input  */}
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] font-semibold text-slate-700 py-2.5 placeholder:text-slate-400"
          />

          {/* submit   */}
          <button
            onClick={handleSendMessage}
            disabled={!text.trim()}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-90 ${
              text.trim()
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
