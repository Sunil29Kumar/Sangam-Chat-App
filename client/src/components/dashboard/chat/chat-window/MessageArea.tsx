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
import Messages from "./message-area-component/Messages";
import PinnedMsg from "./message-area-component/PinnedMsg";

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
  // Context and States
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
          <PinnedMsg
            selectedConversation={selectedConversation}
            scrollToReplayedMessage={scrollToReplayedMessage}
            pinnedMessage={pinnedMessage}
          />

          {/*  Group messages by date and render */}
          <Messages
            groupedMessages={groupedMessages}
            getHeaderLabel={getHeaderLabel}
            user={user}
            handleReply={handleReply}
            scrollToReplayedMessage={scrollToReplayedMessage}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            setMenuBtnPosition={setMenuBtnPosition}
            setCurrentWindowHeight={setCurrentWindowHeight}
            setCurrentWindowWidth={setCurrentWindowWidth}
            menuRef={menuRef}
            currentWindowHeight={currentWindowHeight}
            windowHeight={windowHeight}
            currentWindowWidth={currentWindowWidth}
            windowWidth={windowWidth}
            menuBtnPosition={menuBtnPosition}
            pinnedMessage={pinnedMessage}
            setEditedMessage={setEditedMessage}
            deleteMessageFromEveryone={deleteMessageFromEveryone}
            deleteMessageForMe={deleteMessageForMe}
          />
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
