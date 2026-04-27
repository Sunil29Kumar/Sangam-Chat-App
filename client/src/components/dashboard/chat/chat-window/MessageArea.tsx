import {
  MessageSquare,
  MoreVertical,
  Trash2,
  UserMinus,
  Smile,
  Reply,
} from "lucide-react";
import React, {useState, useRef, useEffect, useContext} from "react";
import {useChat} from "../../../../hooks/useChat";
import {LiaReplySolid} from "react-icons/lia";
import {ChatContext} from "../../../../context/ChatContext";

function MessageArea({
  scrollRef,
  messages,
  user,
}: {
  scrollRef: React.RefObject<HTMLDivElement>;
  messages: any[];
  user: any;
}) {
  const {deleteMessageFromEveryone, deleteMessageForMe} = useChat();
  const chatContext = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  console.log(messages);
  console.log(user._id);

  if (!chatContext) return null;
  const {replyingData, setReplyingData, setIsReplyContainerOpen} = chatContext;

  const filteredMessages = messages.filter(
    (msg) => !msg.deletedBy?.includes(user._id),
  );

  const handleReply = (msg: any) => {
    setIsReplyContainerOpen(true);
    setActiveMenu(null);
    setReplyingData({
      messageSender: msg.sender,
      replyToMessageId: msg._id,
      replyToMessageText: msg.content,
      conversationId: msg.conversationId,
    });
    console.log(replyingData);
  };

  // Bahar click karne par menu band ho jaye
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={scrollRef as React.RefObject<HTMLDivElement>}
      className="flex-1 max-h-4/6 md:max-h-5/7  overflow-y-auto p-10  md:p-5 space-y-6 bg-[#fafafa]   custom-scrollbar scroll-smooth"
    >
      {filteredMessages.length > 0 ? (
        filteredMessages.map((msg, index) => {
          const currentSenderId = msg.sender?._id || msg.sender
          const isMe = currentSenderId?.toString() === user._id?.toString();
          console.log(isMe);

          const isMenuOpen = activeMenu === msg?._id;

          return (
            <div
              key={msg._id || index}
              className={`flex  gap-3 max-w-[85%] group ${isMe ? " ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Message Bubble Container */}
              <div className="relative flex items-center gap-2">
                {/* Extra Features Button (Visible on Hover) */}
                <div
                  className={`opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 ${isMe ? "order-1" : "order-2"}`}
                >
                  <button
                    onClick={() => {
                      handleReply(msg);
                    }}
                  >
                    <LiaReplySolid
                      size={16}
                      className="text-black font-bold cursor-pointer hover:text-indigo-600 transition-colors"
                    />
                  </button>
                  <button
                    onClick={() => setActiveMenu(isMenuOpen ? null : msg._id)}
                    className="p-1.5 cursor-pointer hover:bg-slate-200 rounded-full text-black transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div
                  className={`relative px-4 py-3 rounded-2xl text-[14.5px] font-medium leading-relaxed shadow-sm transition-all ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-none shadow-indigo-100/50 order-2"
                      : "bg-white text-slate-700 rounded-bl-none border border-slate-100 order-1"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`text-[9px] mt-1.5 block font-bold uppercase tracking-tighter opacity-70 ${isMe ? "text-right" : ""}`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* --- Modern Action Dropdown --- */}
                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className={`absolute top-4/5  mb-0 z-50 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in duration-200 ${
                        isMe
                          ? "right-full  origin-bottom-right"
                          : "left-full origin-bottom-left"
                      }`}
                    >
                      <button
                        onClick={() => {
                          handleReply(msg);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Reply size={14} /> Reply
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <Smile size={14} /> React
                      </button>

                      <div className="h-px bg-slate-100 my-1 mx-2" />

                      <button
                        onClick={() => {
                          deleteMessageForMe(msg.conversationId, msg._id);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <UserMinus size={14} /> Delete for me
                      </button>

                      {isMe && (
                        <button
                          onClick={() => {
                            deleteMessageFromEveryone(
                              msg.conversationId,
                              msg._id,
                            );
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                        >
                          <Trash2 size={14} /> Delete for everyone
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-slate-300">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
      <MessageSquare size={40} className="opacity-20" />
    </div>
    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">
      End-to-end encrypted
    </p>
  </div>
);

export default MessageArea;
