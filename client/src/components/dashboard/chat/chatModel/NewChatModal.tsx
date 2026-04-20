import {X, Search, UserPlus,  CheckCircle2, Loader2} from "lucide-react";
import {useChat} from "../../../../hooks/useChat";
import {useContext, useState} from "react";
import {showToast} from "../../../../utils/toast";
import {ChatContext} from "../../../../context/ChatContext";

const NewChatModal = ({
  setIsNewChatModalOpen,
}: {
  setIsNewChatModalOpen: (open: boolean) => void;
}) => {
  const {searchUser, loading, createConversation} = useChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchUserResults, setSearchUserResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const chatContext = useContext(ChatContext);

  if(!chatContext) return null;

  const {getConversations} = chatContext;

  

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchUserResults([]);
      return;
    }
    if (query.length < 3) {
      setSearchUserResults([]);
      return;
    }
    const results = await searchUser(query);
    if (!results?.success) {
      setSearchUserResults([]);
    } else {
      setSearchUserResults(
        (Array.isArray(results.users) ? results.users : [results.user]) || [],
      );
    }
  };

  const handleCreateConversation = async () => {
    if (!selectedUser) {
      return showToast.error("Please select a user to connect.");
    }

    const response = await createConversation(selectedUser);
    if (response.success) {
      setIsNewChatModalOpen(false);
      showToast.success(response.message);
      getConversations(); // Refresh conversations list
    }
  };

  return (
    <div
      onClick={() => setIsNewChatModalOpen(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      <div
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[110] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h3 className="text-3xl font-[1000] text-slate-900 tracking-tight">
              Add Friend
            </h3>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-1.5">
              Connect with the world
            </p>
          </div>
          <button
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-90"
            onClick={() => setIsNewChatModalOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 pt-6 space-y-6">
          {/* Search Input Section */}
          <div className="space-y-3">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                {loading ? (
                  <Loader2 className="text-indigo-600 animate-spin" size={20} />
                ) : (
                  <Search
                    className="text-slate-300 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                )}
              </div>
              <input
                type="text"
                placeholder="Search by username or email..."
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.8rem] outline-none text-[15px] font-bold text-slate-700 transition-all shadow-inner placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                Tip: Enter at least 3 characters
              </p>
            </div>
          </div>

          {/* Search Result Section */}
          <div className="min-h-[180px] max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
            {searchUserResults.length > 0 ? (
              <div className="grid gap-3">
                {searchUserResults.map((user: any) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user._id)}
                    className={`group p-4 rounded-[1.8rem] border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedUser === user._id
                        ? "border-indigo-500 bg-indigo-50/30 shadow-md shadow-indigo-100/50"
                        : "border-slate-50 bg-white hover:border-indigo-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 text-lg border-2 border-white shadow-sm overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-800 text-[15px] truncate">
                          {user.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bold truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      {selectedUser === user._id ? (
                        <CheckCircle2
                          size={24}
                          className="text-indigo-600 fill-indigo-50"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-indigo-200 transition-colors" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3">
                  <UserPlus size={20} className="text-slate-300" />
                </div>
                <p className="text-[12px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                  {searchQuery.length < 3
                    ? "Type to discover\nnew friends"
                    : `No results for\n"${searchQuery}"`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 pt-0 flex gap-3">
          <button
            className="flex-1 py-4.5 text-[12px] font-[1000] text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-[1.5rem] transition-all tracking-[0.1em]"
            onClick={() => setIsNewChatModalOpen(false)}
          >
            DISMISS
          </button>
          <button
            onClick={handleCreateConversation}
            className={`flex-[2] py-4.5 rounded-[1.5rem] text-[12px] font-[1000] tracking-[0.1em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              !selectedUser
                ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                : "bg-slate-900 text-white shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100"
            }`}
            disabled={!selectedUser}
          >
            CONNECT <UserPlus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
