import {Send, Smile} from "lucide-react";
import React from "react";

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
  return (
    <div className="  px-6 bg-white border-t border-slate-50 pt-3 pb-11">
      {/* --- Message Input Container --- */}
      <div className="px-6  bg-white border-t border-slate-50 py-1">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100/80 p-1.5 pl-4 rounded-[1.8rem] focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:bg-white focus-within:border-indigo-100 border-2 border-transparent transition-all shadow-inner">
          <button className="text-slate-400 hover:text-indigo-500 p-2 transition-colors">
            <Smile size={22} />
          </button>
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

        {/* Helper text for safety */}
        <p className="text-center text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-[0.1em]">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}

export default MessageInputContainer;
