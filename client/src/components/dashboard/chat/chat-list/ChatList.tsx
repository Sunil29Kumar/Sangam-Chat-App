import {MessageSquare, Plus, Search, MoreVertical} from "lucide-react";
import AddUser from "./AddUser";
import {ChatContext} from "../../../../context/ChatContext";
import {useContext, useEffect, useState} from "react";
import {useSocket} from "../../../../hooks/useSocket";

const ChatList = ({
  setIsNewChatModalOpen,
}: {
  setIsNewChatModalOpen: (open: boolean) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const context = useContext(ChatContext);

  // Agar context null hai, toh yahi se ruk jao
  if (!context) {
    throw new Error("ChatList must be used within a ChatProvider");
  }

  const {
    getConversations,
    conversations,
    selectedConversation,
    setSelectedConversation,
    loading,
    isTyping,
  } = context;

  const [searchQuery, setSearchQuery] = useState("");
  const {joinRoom} = useSocket();

  useEffect(() => {
    getConversations();
  }, []);

  // Filter conversations based on search
  const filteredConversations = conversations?.filter((c: any) =>
    c.otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConversationClick = (conv: any) => {
    setSelectedConversation(conv); // Right window update hogi
    joinRoom(conv?._id); // Socket room join hoga
  };

  return (
    <div className="w-full md:w-80 lg:w-[380px] h-screen border-r border-slate-100 flex flex-col bg-white select-none">
      {/* --- Header Section --- */}
      <div className="p-7 pb-5">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none">
              Messages
            </h2>
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-2">
              {conversations?.length || 0} active chats
            </p>
          </div>

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
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.2rem] outline-none text-sm font-semibold text-slate-700 transition-all placeholder:text-slate-400 shadow-inner"
          />
        </div>
      </div>

      {/* --- Conversations List --- */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm font-medium text-slate-500">
            Loading conversations...
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-10 custom-scrollbar">
          {filteredConversations && filteredConversations.length > 0 ? (
            filteredConversations.map((conversation: any) => (
              <div
                key={conversation._id}
                onClick={() => handleConversationClick(conversation)}
                className={`relative flex items-center gap-4 p-3.5 rounded-[1.4rem] hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-indigo-50 group active:scale-[0.98] ${selectedConversation?._id === conversation._id ? "bg-indigo-50 border-indigo-100" : ""}`}
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
                  {/* Online Indicator (Optional - can be tied to real state later) */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full shadow-sm"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-extrabold text-slate-800 truncate text-[15px] tracking-tight group-hover:text-indigo-700 transition-colors">
                      {conversation.otherParticipant?.name}
                    </h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase ml-2 flex-shrink-0">
                      {conversation.lastMessage?.time || "12:45 PM"}
                    </span>
                  </div>

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

                    {/* Unread Badge (Mockup) */}
                    <div className="hidden group-hover:block transition-all">
                      <MoreVertical
                        size={14}
                        className="text-slate-300 hover:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
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
