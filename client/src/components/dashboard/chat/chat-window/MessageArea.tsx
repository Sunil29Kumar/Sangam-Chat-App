import {
  MessageSquare,
  MoreVertical,
  Trash2,
  UserMinus,
  Smile,
  Reply,
  Edit,
  Check,
  CheckCheck,
} from "lucide-react";
import React, {useState, useRef, useEffect, useContext, useMemo} from "react";
import {useChat} from "../../../../hooks/useChat";
import {LiaReplySolid} from "react-icons/lia";
import {ChatContext} from "../../../../context/ChatContext";
import {formatTime} from "../../../../utils/formatTime";

function MessageArea({
  scrollRef,
  messages,
  user,
  selectedConversation,
}: {
  scrollRef: React.RefObject<HTMLDivElement>;
  messages: any[];
  user: any;
  selectedConversation: any;
}) {
  const {deleteMessageFromEveryone, deleteMessageForMe} = useChat();
  const chatContext = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [currentWindowHeight, setCurrentWindowHeight] = useState<number | null>(
    null,
  );
  const windowHeight = window.innerHeight;

  if (!chatContext) return null;
  const {setReplyingData, setIsReplyContainerOpen, conversations} = chatContext;

  // 1. Filter Deleted Messages
  const filteredMessages = messages.filter(
    (msg) => !msg.deletedBy?.includes(user._id),
  );

  // 2. Group Messages by Date (useMemo for performance)
  const groupedMessages = useMemo(() => {
    return filteredMessages.reduce((groups: any, msg: any) => {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  }, [filteredMessages]);

  // 3. Date Header Label Function
  const getHeaderLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleReply = (msg: any) => {
    setIsReplyContainerOpen(true);
    setActiveMenu(null);
    setReplyingData({
      messageSender: msg.sender,
      replyToMessageId: msg._id,
      replyToMessageText: msg.content,
      conversationId: msg.conversationId,
    });
  };

  const scrollToReplayedMessage = (messageId: string) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({behavior: "smooth", block: "center"});
      element.classList.add("bg-indigo-100/50");
      setTimeout(() => element.classList.remove("bg-indigo-100/50"), 2000);
    }
  };

  // Click outside to close menu
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
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-[#fafafa] custom-scrollbar scroll-smooth"
    >
      {Object.keys(groupedMessages).length > 0 ? (
        Object.entries(groupedMessages).map(([date, msgs]: [string, any]) => (
          <div key={date} className="space-y-6">
            {/* --- Date Separator --- */}
            <div className="flex justify-center my-8">
              <span className="bg-white border border-slate-200 shadow-sm px-4 py-1 rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {getHeaderLabel(date)}
              </span>
            </div>

            {/* --- Messages for this Date --- */}
            {msgs.map((msg: any, index: number) => {
              const currentSenderId = msg.sender?._id || msg.sender;
              const isMe = currentSenderId?.toString() === user._id?.toString();
              const isMenuOpen = activeMenu === msg?._id;
              const formattedTime = formatTime(msg.createdAt);

              return (
                <div
                  key={msg._id || index}
                  id={msg._id}
                  className={`flex gap-3 max-w-[85%] group transition-all ${
                    isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <span className="text-[10px] self-end mb-1 text-slate-400 font-medium">
                    {formattedTime}
                  </span>

                  <div className="relative flex items-center gap-2">
                    {/* Hover Actions */}
                    <div
                      className={`opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${isMe ? "" : "order-2"}`}
                    >
                      <button
                        onClick={() => handleReply(msg)}
                        className="p-1.5 hover:bg-slate-100 rounded-full"
                      >
                        <LiaReplySolid size={18} className="text-slate-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          setActiveMenu(isMenuOpen ? null : msg._id);
                          setCurrentWindowHeight(e.clientY);
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded-full"
                      >
                        <MoreVertical size={16} className="text-slate-600" />
                      </button>
                    </div>

                    <div className="flex flex-col">
                      {/* Reply Bubble */}
                      {msg.replyTo && (
                        <div
                          onClick={() =>
                            scrollToReplayedMessage(msg.replyTo.messageId)
                          }
                          className={`z-0 p-2 pb-3 -mb-2 cursor-pointer rounded-t-xl border-l-4 shadow-sm text-xs ${
                            isMe
                              ? "bg-indigo-100 border-indigo-400"
                              : "bg-slate-200 border-slate-400"
                          }`}
                        >
                          <span className="font-bold block text-[10px] text-indigo-600">
                            {msg.replyTo?.replayerId === user._id
                              ? "You"
                              : msg.sender?.name || "User"}
                          </span>
                          <p className="line-clamp-1 italic opacity-70">
                            {msg.replyTo?.content}
                          </p>
                        </div>
                      )}

                      {/* Main Message Bubble */}
                      <div
                        className={`relative px-4 py-2.5 shadow-sm text-[14.5px] leading-relaxed ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-2xl rounded-br-none"
                            : "bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-100"
                        }`}
                      >
                        <div className=" flex gap-2 justify-center items-end ">
                          {/* main message  */}
                          <p className="whitespace-pre-wrap">{msg.content}</p>

                          {/* is readed status ke ticks   */}
                          {msg.sender?._id === user._id && (
                            <span className="flex-shrink-0">
                              {msg?.isRead ? (
                                <CheckCheck
                                  size={14}
                                  className="text-blue-500"
                                />
                              ) : msg?.isDelivered ? (
                                <CheckCheck
                                  size={14}
                                  className="text-slate-400"
                                /> // Double Tick
                              ) : (
                                <Check size={14} className="text-slate-400" /> // Single Tick
                              )}
                            </span>
                          )}
                        </div>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className={`absolute z-50 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 animate-in fade-in zoom-in duration-150 ${
                              currentWindowHeight! < windowHeight / 2
                                ? "top-full mt-2"
                                : "bottom-full mb-2"
                            } ${isMe ? "right-0" : "left-0"}`}
                          >
                            <button
                              onClick={() => handleReply(msg)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <Reply size={14} /> Reply
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                              <Edit size={14} /> Edit{" "}
                              <span className="text-[10px] opacity-50">
                                (Soon)
                              </span>
                            </button>
                            <div className="h-px bg-slate-100 my-1" />
                            <button
                              onClick={() =>
                                deleteMessageForMe(msg.conversationId, msg._id)
                              }
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50"
                            >
                              <UserMinus size={14} /> Delete for me
                            </button>
                            {isMe && (
                              <button
                                onClick={() =>
                                  deleteMessageFromEveryone(
                                    msg.conversationId,
                                    msg._id,
                                  )
                                }
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50"
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
            })}
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-slate-300">
    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
      <MessageSquare size={32} className="opacity-20" />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
      End-to-end encrypted
    </p>
  </div>
);

export default MessageArea;
