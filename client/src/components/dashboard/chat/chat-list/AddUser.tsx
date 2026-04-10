import {MessageSquare, Users} from "lucide-react";
import React from "react";

function AddUser({
  setIsMenuOpen,
  setIsNewChatModalOpen,
}: {
  setIsMenuOpen: (open: boolean) => void;
  setIsNewChatModalOpen: (open: boolean) => void;
}) {
  return (
    <div className="absolute right-6 top-[100%] w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[60] p-2 animate-in fade-in zoom-in duration-200">
      <button
        onClick={() => {
          setIsMenuOpen(false);
          setIsNewChatModalOpen(true);
        }}
        className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl text-slate-700 transition-all"
      >
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <MessageSquare size={16} />
        </div>
        <span className="text-sm font-bold">New Chat</span>
      </button>

      <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-slate-400 cursor-not-allowed">
        <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
          <Users size={16} />
        </div>
        <span className="text-sm font-bold">New Group</span>
      </button>
    </div>
  );
}

export default AddUser;
