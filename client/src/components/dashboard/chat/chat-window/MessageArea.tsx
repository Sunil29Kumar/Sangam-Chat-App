import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  MessageSquare,
  MoreVertical,
  Trash2,
  UserMinus,
  Reply,
  Edit,
  Check,
  CheckCheck,
  Pin,
  X,
} from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {useChat} from "../../../../hooks/useChat";
import {LiaReplySolid} from "react-icons/lia";
import {ChatContext} from "../../../../context/ChatContext";

import {BiDownArrow} from "react-icons/bi";

function MessageArea({
  scrollRef,
  messages,
  user,
  selectedConversation,
  scrollToReplayedMessage,
}: {
  // scrollRef: React.RefObject<HTMLDivElement>;
  messages: any[];
  user: any;
  selectedConversation: any;
  scrollToReplayedMessage: (messageId: string) => void;
}) {
  const {deleteMessageFromEveryone, deleteMessageForMe, pinnedMessage} =
    useChat();
  const chatContext = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [currentWindowHeight, setCurrentWindowHeight] = useState<number | null>(
    null,
  );
  const [currentWindowWidth, setCurrentWindowWidth] = useState<number | null>(
    null,
  );
  const [menuBtnPosition, setMenuBtnPosition] = useState({y: 0, x: 0});
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  if (!chatContext) return null;
  const {
    setReplyingData,
    isReplyContainerOpen,
    setIsReplyContainerOpen,
    conversations,
    isMessagesLoading,
    setEditedMessage,
  } = chatContext;

  const prevMessageLength = useRef(messages.length);

  // console.log("conversation ", conversations);

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

  const scrollBottomForNewMessage = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef]);

  const isEligibleForScrollButton = (
    scrollTop: number,
    scrollHeight: number,
  ) => {
    const threshold = 150;
    return scrollHeight - scrollTop - windowHeight > threshold;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setIsScrollButtonVisible(
      isEligibleForScrollButton(target.scrollTop, target.scrollHeight),
    );
  };

  const clickScrollBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const isNewMessageAdded = messages.length > prevMessageLength.current;
    if (isNewMessageAdded) {
      scrollBottomForNewMessage();
    }
    prevMessageLength.current = messages.length;
  }, [messages, scrollBottomForNewMessage]);

  // ------  end of scroll features  -----

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef, setActiveMenu]);

  // SkeletonTheme loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#fafafa]">
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
          {/* Date Badge Skeleton */}
          <div className="flex justify-center my-8">
            <Skeleton width={120} height={24} borderRadius={20} />
          </div>

          <div className="space-y-8">
            {[...Array(4)].map((_, i) => {
              const isMe = i % 2 !== 0; // Left-Right toggle
              return (
                <div
                  key={i}
                  className={`flex gap-3 max-w-[85%] ${
                    isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {/* Time Skeleton (Aligned to bottom of bubble) */}
                  <div className="self-end mb-1">
                    <Skeleton width={50} height={10} />
                  </div>

                  <div className="flex flex-col">
                    {/* Message Bubble Skeleton */}
                    <Skeleton
                      height={44}
                      width={isMe ? 180 : 220}
                      borderRadius={16}
                      style={{
                        borderBottomRightRadius: isMe ? 0 : 16,
                        borderBottomLeftRadius: isMe ? 16 : 0,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="  flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-[#fafafa] custom-scrollbar    "
    >
      {Object.keys(groupedMessages).length > 0 ? (
        <>
          {/* scroll to bottom button */}
          {isScrollButtonVisible && (
            <div
              className={`fixed ${isReplyContainerOpen ? "bottom-55  md:bottom-35" : "bottom-30 md:bottom-15"}   z-100`}
            >
              <div
                onClick={clickScrollBottom}
                className="group bg-white/80 backdrop-blur-md p-3 cursor-pointer rounded-2xl 
               flex justify-center items-center shadow-lg border border-slate-200 
               hover:bg-indigo-600 transition-all duration-300 ease-in-out 
               active:scale-90 animate-bounce"
              >
                <BiDownArrow
                  size={18}
                  className="text-indigo-600 group-hover:text-white transition-colors duration-300"
                />
              </div>
            </div>
          )}

          {/* Pinned Message Section */}
          {selectedConversation?.pinnedMessage &&
            selectedConversation?.pinnedMessage != null && (
              <div
                onClick={() =>
                  scrollToReplayedMessage(
                    selectedConversation.pinnedMessage._id,
                  )
                }
                className="sticky top-0 z-100  bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-2 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Left Accent Bar */}
                  <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>

                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      Pinned Message
                    </span>
                    <p className="text-sm text-slate-700 truncate max-w-[250px] md:max-w-[500px]">
                      {selectedConversation.pinnedMessage.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Pin Icon */}
                  <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <Pin size={16} />
                  </span>

                  {/* Close/Unpin Button (Optional) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Taaki click message par jump na kare
                      // handleUnpin logic
                      pinnedMessage(
                        selectedConversation._id,
                        selectedConversation.pinnedMessage._id,
                      );
                    }}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

          {/*  Group messages by date and render */}
          {Object.entries(groupedMessages).map(
            ([date, msgs]: [string, any]) => (
              <div key={date} className="  space-y-6 ">
                {/* --- Date Separator --- */}
                <div className="flex justify-center my-8">
                  <span className="bg-white border border-slate-200 shadow-sm px-4 py-1 rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {getHeaderLabel(date)}
                  </span>
                </div>

                {/* --- Messages for this Date --- */}
                {msgs.map((msg: any, index: number) => {
                  const currentSenderId = msg.sender?._id || msg.sender;
                  const isMe =
                    currentSenderId?.toString() === user._id?.toString();
                  const isMenuOpen = activeMenu === msg?._id;
                  const time = new Date(msg?.createdAt);
                  const formattedTime = `${time.getHours()}:${time.getMinutes()} ${time.getHours() >= 12 ? "PM" : "AM"}`;

                  return (
                    <div
                      key={msg._id || index}
                      id={msg._id}
                      className={`flex gap-3  max-w-[85%]  group transition-all  ${
                        isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      <div className="relative flex items-end justify-end gap-2">
                        {/* Hover Actions */}
                        <div
                          className={`md:opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${isMe ? "" : "order-2"}`}
                        >
                          {/* reply button  */}
                          <button
                            onClick={() => handleReply(msg)}
                            className=" hidden md:block p-1.5 hover:bg-slate-100 rounded-full"
                          >
                            <LiaReplySolid
                              size={18}
                              className="text-slate-600"
                            />
                          </button>
                          {/* menu button  */}
                          <button className="p-1.5 hover:bg-slate-100 rounded-full">
                            <MoreVertical
                              size={16}
                              className="text-slate-600 cursor-pointer "
                              onClick={(e) => {
                                setActiveMenu(isMenuOpen ? null : msg._id);
                                console.log("cx", e.clientX, "cy", e.clientY);
                                setMenuBtnPosition({x: e.pageX, y: e.pageY});
                                setCurrentWindowHeight(e.clientY);
                                setCurrentWindowWidth(e.clientX);
                              }}
                            />
                          </button>
                        </div>

                        <div className="flex flex-col">
                          {/* ---------- Reply Bubble ---------- */}
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

                          {/* Main Message Bubble  ------------- */}
                          <div
                            className={`relative px-4 py-2.5 shadow-sm text-md leading-relaxed     ${
                              isMe
                                ? "bg-indigo-600 text-white rounded-2xl rounded-br-none"
                                : "bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-100"
                            }`}
                          >
                            <div className=" flex flex-row  items-end gap-2 max-w-full min-w-0 ">
                              <div>
                                {/* main message  */}
                                <p
                                  className="whitespace-pre-wrap leading-relaxed flex-1 min-w-0  break-all"
                                  style={{overflowWrap: "anywhere"}} // Force breaking for long sssss text
                                >
                                  {msg.content}
                                </p>

                                {/* message time  */}
                                <p className="text-[8px] self-end mb-1 text-slate-400 font-medium  ">
                                  {formattedTime}
                                </p>
                              </div>

                              {/* is readed status ke ticks   */}
                              {msg.sender?._id === user._id && (
                                <span className=" mb-1 sm:mb-0 sm:ml-2 ">
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
                                    <Check
                                      size={14}
                                      className="text-slate-400"
                                    /> // Single Tick
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* -------------  Dropdown Menu ----------- */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          // Fixed positioning use karo taaki exact coordinates pe place ho sake
                          className="fixed z-[999] w-48 bg-white border border-slate-100 shadow-2xl rounded-xl py-2 animate-in fade-in zoom-in duration-150"
                          style={{
                            // X-axis: Agar 'isMe' hai toh thoda left shift karo taaki menu icon ke upar na aaye
                            left:
                              currentWindowHeight! > windowHeight / 2
                                ? isMe
                                  ? currentWindowWidth! > windowWidth / 2
                                    ? `${menuBtnPosition.x - 200}px`
                                    : `${menuBtnPosition.x + 10}px`
                                  : currentWindowWidth! > windowWidth / 2
                                    ? `${menuBtnPosition.x - 200}px`
                                    : `${menuBtnPosition.x + 1}px`
                                : isMe
                                  ? currentWindowWidth! > windowWidth / 2
                                    ? `${menuBtnPosition.x - 175}px`
                                    : `${menuBtnPosition.x - 5}px`
                                  : currentWindowWidth! > windowWidth / 2
                                    ? `${menuBtnPosition.x - 180}px`
                                    : `${menuBtnPosition.x - 5}px`,

                            // Y-axis: Agar screen ke bahut niche hai toh menu ko upar shift kar do
                            top:
                              currentWindowHeight! > windowHeight / 2
                                ? isMe
                                  ? `${menuBtnPosition.y - 190}px`
                                  : `${menuBtnPosition.y - 151}px`
                                : isMe
                                  ? `${menuBtnPosition.y + 15}px`
                                  : `${menuBtnPosition.y + 27}px`,
                          }}
                        >
                          {/* reply  */}
                          <button
                            onClick={() => {
                              handleReply(msg);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Reply size={14} /> Reply
                          </button>
                          {/* pinned message  */}
                          <button
                            onClick={() => {
                              pinnedMessage(msg.conversationId, msg._id);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Pin size={14} /> Pin
                          </button>
                          {/* edit  */}
                          {user?._id === msg?.sender?._id && !msg?.isRead && (
                            <button
                              onClick={() => {
                                setEditedMessage({
                                  content: msg.content,
                                  messageId: msg._id,
                                  conversationId: msg.conversationId,
                                });
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <Edit size={14} /> Edit{" "}
                            </button>
                          )}
                          {/* delete message  */}
                          <div className="h-px bg-slate-100 my-1" />
                          <button
                            onClick={() => {
                              deleteMessageForMe(msg.conversationId, msg._id);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50"
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
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50"
                            >
                              <Trash2 size={14} /> Delete for everyone
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ),
          )}
        </>
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
