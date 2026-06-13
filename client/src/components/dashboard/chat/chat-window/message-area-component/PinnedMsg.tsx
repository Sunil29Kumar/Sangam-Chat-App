import {Pin, X} from "lucide-react";

function PinnedMsg({
  selectedConversation,
  scrollToReplayedMessage,
  pinnedMessage,
}: any) {
  return (
    <>
      {selectedConversation?.pinnedMessage &&
        selectedConversation?.pinnedMessage != null && (
          <div
            onClick={() =>
              scrollToReplayedMessage(selectedConversation.pinnedMessage._id)
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
    </>
  );
}

export default PinnedMsg;
