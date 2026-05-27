import { useContext } from "react";
import { ChatContext } from "../../../../context/ChatContext";
import { CgClose } from "react-icons/cg";
import { IoMailOutline, IoTimeOutline, IoTrashOutline } from "react-icons/io5";
import { Ban } from "lucide-react";

function ChatDetailsPanel() {
  const chatContext = useContext(ChatContext);
  if (!chatContext) return null;
  const { setSelectedChatMenuOption, selectedConversation } = chatContext;

  const user = selectedConversation?.otherParticipant;

  if (!user) {
    return (
      <div className="h-full w-full bg-slate-50 text-slate-400 flex items-center justify-center font-medium">
        No conversation selected
      </div>
    );
  }

  return (
    <div className="  bg-white flex flex-col border-l border-slate-200 shadow-sm animate-in slide-in-from-right duration-200">
      
      {/* Header Section */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-100 bg-slate-50/50">
        <button 
          onClick={() => setSelectedChatMenuOption("")}
          className="p-1.5 rounded-full hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-all duration-200"
        >
          <CgClose size={20} />
        </button>
        <h2 className="text-md font-bold text-slate-800 tracking-wide">Contact Info</h2>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 select-none">
        
        {/* Profile Card Center */}
        <div className="flex flex-col items-center text-center bg-indigo-50/40 p-6 rounded-2xl border border-indigo-100/60 shadow-sm">
          <div className="relative mb-3">
            <img 
              src={user.profilePic || "https://placehold.co/150"} 
              alt={user.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <span className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
              user.isonline ? "bg-green-500" : "bg-slate-300"
            }`}></span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold mt-1.5 inline-block ${
            user.isonline 
              ? "bg-green-100 text-green-700" 
              : "bg-slate-100 text-slate-500"
          }`}>
            {user.isonline ? "Online" : `Offline`}
          </span>
          {!user.isonline && user.lastseen && (
            <p className="text-[11px] text-slate-400 mt-1">Last seen: {user.lastseen}</p>
          )}
        </div>

        {/* User Details Section */}
        <div className="flex flex-col gap-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider pl-1">About</h4>
          
          {/* Email Row */}
          <div className="flex items-start gap-3.5 text-slate-600 text-sm">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mt-0.5">
              <IoMailOutline size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Email Address</span>
              <span className="font-medium text-slate-700 break-all mt-0.5">{user.email}</span>
            </div>
          </div>

         
        </div>

        {/* Danger Zone Actions */}
        <div className="flex flex-col gap-2.5 mt-auto">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100/70 border border-red-100 rounded-xl transition-all duration-200 active:scale-[0.98]">
            <Ban size={16} />
            <span>Block {user.name}</span>
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 bg-transparent hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all duration-200 active:scale-[0.98]">
            <IoTrashOutline size={16} />
            <span>Delete Chat</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default ChatDetailsPanel;