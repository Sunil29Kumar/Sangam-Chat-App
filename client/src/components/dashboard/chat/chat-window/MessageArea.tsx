import {MessageSquare} from "lucide-react";
import React from "react";

function MessageArea({
  scrollRef,
  messages,
  user,
}: {
  scrollRef: React.RefObject<HTMLDivElement>;
  messages: any[];
  user: any;
 
}) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa] custom-scrollbar scroll-smooth"
    >
      {messages.length > 0 ? (
        messages.map((msg, index) => {
          const isMe = msg.sender === user._id || msg.senderId === user._id;
          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-[14.5px] font-medium leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-br-none shadow-indigo-100/50"
                    : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                }`}
              >
                <p>{msg.content}</p>
                <span
                  className={`text-[9px] mt-1.5 block font-bold uppercase tracking-tighter opacity-70 ${
                    isMe ? "text-right" : ""
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-slate-300">
          <MessageSquare size={40} className="mb-2 opacity-20" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">
            End-to-end encrypted
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
