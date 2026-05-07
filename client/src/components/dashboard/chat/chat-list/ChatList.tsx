import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  MessageSquare,
  Plus,
  Search,
  CheckCheck,
  Check,
  Pin,
  Ban,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import AddUser from "./AddUser";
import {ChatContext} from "../../../../context/ChatContext";
import {useContext, useEffect, useState} from "react";
import {useSocket} from "../../../../hooks/useSocket";
import {formatTime} from "../../../../utils/formatTime";
import {AuthContext} from "../../../../context/AuthContext";
import {useChat} from "../../../../hooks/useChat";

const ChatList = ({
  setIsNewChatModalOpen,
}: {
  setIsNewChatModalOpen: (open: boolean) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const {deleteConversation} = useChat();

  // Agar context null hai, toh yahi se ruk jao
  if (!chatContext || !authContext) {
    throw new Error("ChatList must be used within a ChatProvider");
  }

  const {
    getConversations,
    conversations,
    selectedConversation,
    setSelectedConversation,
    loading,
    isTyping,
    updateLastMessageInList,
    setConversations,
    setMessages,
  } = chatContext;

  const {user} = authContext;

  const [searchQuery, setSearchQuery] = useState("");
  const {joinRoom, socket} = useSocket();
  const [isConvMenuOpen, setIsConvMenuOpen] = useState(false);
  // console.log("conversition = " ,conversations);

  // Filter conversations based on search
  const filteredConversations = conversations?.filter((c: any) =>
    c.otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDeletedConversations = filteredConversations?.filter(
    (c: andy) => !c.deletedBy?.includes((user as any)._id),
  );

  console.log(filteredDeletedConversations);

  const handleConversationClick = (conv: any) => {
    setSelectedConversation(conv); // Right window update hogi
    joinRoom(conv?._id); // Socket room join hoga
  };

  useEffect(() => {
    if (!socket) return;

    // Jab naya message aaye (Text update karne ke liye)
    socket.on("new_message", (message: any) => {
      if (message.conversationId === selectedConversation?._id) {
        updateLastMessageInList(message);
        socket.emit("mark_as_read", {
          conversationId: selectedConversation._id,
          userId: (user as any)?._id,
        });
      }
    });

    return () => {
      socket.off("new_message");
      socket.off("message_status_update");
    };
  }, [
    socket,
    updateLastMessageInList,
    setConversations,
    selectedConversation,
    user,
  ]);

  useEffect(() => {
    getConversations();
  }, []);

  // SkeletonTheme loading
  if (loading) {
    return (
      <div className="p-5 space-y-6 bg-white h-full overflow-hidden">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 px-1">
          <div className="flex flex-col gap-1">
            <Skeleton width={120} height={28} borderRadius={8} />
            <Skeleton width={80} height={16} borderRadius={6} />
          </div>
          <Skeleton width={48} height={48} borderRadius={16} />
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <Skeleton height={48} borderRadius={16} />
        </div>

        {/* Conversations List Skeleton */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-2">
              {/* Avatar Skeleton - Exactly like your UI */}
              <Skeleton width={56} height={56} borderRadius={20} />

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  {/* Name Skeleton */}
                  <Skeleton width={100} height={18} />
                  {/* Time Skeleton */}
                  <Skeleton width={50} height={12} />
                </div>

                <div className="flex justify-between items-center">
                  {/* Message Preview Skeleton */}
                  <Skeleton width={140} height={14} />
                  {/* Tick/Status Icon */}
                  <Skeleton circle width={14} height={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 lg:w-[380px]  h-screen border-r border-slate-100 flex flex-col bg-white select-none">
      <div className="p-7 pb-5">
        {/* --- Header  --- */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none">
              Messages
            </h2>
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-2">
              {conversations?.length || 0} active chats
            </p>
          </div>

          {/* add user  */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group relative w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-90"
          >
            <Plus
              size={22}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            {isMenuOpen && (
              <div className="absolute top-11 right-0">
                <AddUser
                  setIsMenuOpen={setIsMenuOpen}
                  setIsNewChatModalOpen={setIsNewChatModalOpen}
                />
              </div>
            )}
          </button>
        </div>

        {/* --- Search Bar --- */}
        <div className="w-full flex justify-start items-center gap-2 pl-2  bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.2rem]  transition-all  group">
          <Search
            className="  text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" py-3 px-1 w-full border-2 border-transparent outline-none  font-semibold  text-slate-700 placeholder:text-slate-400 shadow-inner "
          />
        </div>
      </div>

      {/* --- Conversations List --- */}
      {loading ? (
        <></>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-10 custom-scrollbar ">
          {filteredDeletedConversations &&
          filteredDeletedConversations.length > 0 ? (
            filteredDeletedConversations.map((conversation: any) => (
              <div
                key={conversation._id}
                onClick={() => handleConversationClick(conversation)}
                className={` flex items-center gap-4 p-3.5 rounded-[1.4rem] hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-indigo-50 group active:scale-[0.98] ${selectedConversation?._id === conversation._id ? "bg-indigo-50 border-indigo-100" : ""}`}
              >
                {/* Avatar section with Status */}
                <div className="relative flex-shrink-0">
                  <div className="w-[54px] h-[54px] rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm transition-transform group-hover:scale-105 duration-300">
                    <img
                      src={
                        conversation.otherParticipant?.profilePic ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.otherParticipant?.name}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  {/* name and time  */}
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-extrabold text-slate-800 truncate text-[15px] tracking-tight group-hover:text-indigo-700 transition-colors">
                      {conversation.otherParticipant?.name}
                    </h4>
                    <span className="text-[10px]  text-slate-400  ml-2 flex-shrink-0">
                      {/* {conversation.lastMessage?.createdAt.to || "12:45 PM"} */}
                      {formatTime(conversation.lastMessage?.createdAt)}
                    </span>
                  </div>

                  {/* text  */}
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-[13px] text-slate-500 truncate font-medium max-w-[180px]">
                      {conversation.lastMessage?.text ||
                        conversation.otherParticipant?.email}
                    </p>

                    {isTyping &&
                    selectedConversation?._id === conversation._id ? (
                      <span className="text-xs font-bold text-green-500 ">
                        Typing...
                      </span>
                    ) : null}

                    {/* button 🔼  */}
                    <div className=" relative   ">
                      <MoreHorizontal
                        size={14}
                        className="text-slate-600 hover:text-slate-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsConvMenuOpen(
                            isConvMenuOpen === conversation._id
                              ? null
                              : conversation._id,
                          );
                        }}
                      />
                      {/* menu  */}
                      {isConvMenuOpen === conversation._id && (
                        <div className="absolute right-0  bg-white border border-slate-200 shadow-xl rounded-xl py-2 w-45 mt-2  z-100 ">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            onClick={(e) => {
                              e.stopPropagation(); /* Logic */
                            }}
                          >
                            <Pin size={15} /> Pin Chat
                          </button>

                          <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            onClick={(e) => {
                              e.stopPropagation(); /* Logic */
                            }}
                          >
                            <Ban size={15} /> Block User
                          </button>

                          <div className="h-[1px] bg-slate-50 my-1 mx-2" />

                          <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conversation._id);
                            }}
                          >
                            <Trash2 size={15} /> Delete Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Agar last message mere dwara bheja gaya hai, toh ticks dikhao */}
                {conversation.lastMessage?.sender === (user as any)?._id && (
                  <span className="flex-shrink-0">
                    {conversation.lastMessage?.isRead ? (
                      <CheckCheck size={14} className="text-blue-500" />
                    ) : conversation.lastMessage?.isDelivered ? (
                      <CheckCheck size={14} className="text-slate-400" /> // Double Tick
                    ) : (
                      <Check size={14} className="text-slate-400" /> // Single Tick
                    )}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                No conversations found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
