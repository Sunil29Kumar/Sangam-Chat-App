import {
  MessageSquare,
  MoreVertical,
  Trash2,
  UserMinus,
  Smile,
  Reply,
  Edit,
  CheckCheck,
} from "lucide-react";
import React, {useState, useRef, useEffect, useContext} from "react";
import {useChat} from "../../../../hooks/useChat";
import {LiaReplySolid} from "react-icons/lia";
import {ChatContext} from "../../../../context/ChatContext";
import {SiElectronbuilder} from "react-icons/si";
import { GrCheckboxSelected } from "react-icons/gr";

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
  const windowHeight = window.innerHeight;
  const [currentWindowHeight, setCurrentWindowHeight] = useState<number | null>(
    null,
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

  const scrollToReplayedMessage = (messageId: string) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({behavior: "smooth", block: "center"});

      // Thoda highlight effect (Optional but cool)
      element.classList.add("bg-indigo-100");
      setTimeout(() => {
        element.classList.remove("bg-indigo-100");
      }, 2000);
    }
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
      // onMouseMove={(e) => }
      ref={scrollRef as React.RefObject<HTMLDivElement>}
      className="flex-1 max-h-4/6 md:max-h-5/7  overflow-y-auto p-10  md:p-5 space-y-6 bg-[#fafafa]   custom-scrollbar scroll-smooth"
    >
      {filteredMessages.length > 0 ? (
        filteredMessages.map((msg, index) => {
          const currentSenderId = msg.sender?._id || msg.sender;
          const isMe = currentSenderId?.toString() === user._id?.toString();
          console.log(isMe);

          const isMenuOpen = activeMenu === msg?._id;

          return (
            <div
              key={msg._id || index}
              id={msg._id}
              className={`flex  gap-3  max-w-[85%] group ${isMe ? " ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Message Bubble Container */}
              <div className="relative flex items-center gap-2">
                {/* Extra Features Button (Visible on Hover) */}
                <div
                  className={`opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 ${isMe ? "" : "order-2"}`}
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
                    onClick={(e) => {
                      setActiveMenu(isMenuOpen ? null : msg._id);
                      setCurrentWindowHeight(e?.clientY);
                    }}
                    className="p-1.5 cursor-pointer hover:bg-slate-200 rounded-full text-black transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* main content + reply container  */}
                <div>
                  {/* reply container  */}
                  {msg.replyTo && (
                    <div
                      onClick={() =>
                        scrollToReplayedMessage(msg?.replyTo?.messageId)
                      }
                      className={` z-0 p-2 cursor-pointer pb-4 rounded-t-xl  flex flex-col gap-0.5 shadow-sm transition-all border-l-4 ${
                        isMe
                          ? "bg-indigo-500/20 border-indigo-300 text-black  "
                          : "bg-slate-200/50 border-indigo-500 text-slate-600  "
                      }`}
                    >
                      <span className="font-bold text-[10px] uppercase tracking-wider opacity-80">
                        {msg.replyTo?.replayerId === user._id
                          ? "You"
                          : msg.sender?.name || "User"}
                      </span>
                      <p className="line-clamp-1 italic text-[12px] opacity-90">
                        {msg.replyTo?.content}
                      </p>
                    </div>
                  )}

                  {/* main content  */}
                  <div
                    className={`relative px-4 py-2 ${msg.replyTo ? "" : "rounded-t-2xl"} text-[14.5px] font-medium leading-relaxed shadow-sm transition-all ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-none rounded-bl-2xl shadow-indigo-100/50 order-2"
                        : "bg-white text-slate-700 rounded-bl-none rounded-br-2xl border border-slate-100 order-1"
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
                        className={`absolute ${currentWindowHeight < windowHeight / 2 ? " top-full " : " bottom-full mb-3  "} bg-white  z-100 min-w-48 max-w-auto  border border-slate-100 shadow-2xl rounded-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in duration-200 ${
                          isMe
                            ? "right-full origin-bottom-right"
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
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          <Edit size={14} /> Edit <span className=" text-[10px] "> ( Comming soon )</span>
                        </button>
                        <button className="w-full flex items-center gap-3  px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          <GrCheckboxSelected size={14} /> Select <span className=" text-[10px] "> ( Comming soon )</span>
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
