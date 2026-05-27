import {useContext} from "react";
import {ChatContext} from "../../../../context/ChatContext";
import {
  User,
  Search,
  CheckSquare,
  Ban,
  Star,
  Trash2,
  XCircle,
} from "lucide-react"; // Icons add karne ke liye

function ChatMenu() {
  const chatContext = useContext(ChatContext);
  if (!chatContext) return null;
  const {
    selectedChatMenueOption,
    setSelectedChatMenuOption,
    setIsChatMenuOpen,
  } = chatContext;

  const menuOptions = [
    {id: "contact_info", label: "Contact info", icon: User},
    {id: "search", label: "Search", icon: Search},
    {id: "select_message", label: "Select Message", icon: CheckSquare},
    {id: "add_to_favourites", label: "Add To Favourites", icon: Star},
    {id: "block", label: "Block", icon: Ban, danger: true},
    {id: "clear_chat", label: "Clear chat", icon: Trash2, danger: true},
    {id: "delete_chat", label: "Delete Chat", icon: XCircle, danger: true},
  ];

  const handleOptionClick = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    setSelectedChatMenuOption(optionId);
    console.log(`Option selected: ${optionId}`);
  };

  return (
    <div
      className="absolute right-2 top-15 w-48 bg-white p-2 border border-slate-200 rounded-lg shadow-lg z-10"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex flex-col">
        {menuOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              onClick={(e) => {
                setIsChatMenuOpen(false);
                handleOptionClick(e, option.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left font-medium transition-all duration-200
            
                ${
                  option.danger
                    ? "text-red-400 hover:bg-red-500/10 "
                    : "hover:bg-indigo-200  "
                }
              `}
            >
              {/* Icon component dynamically rendered */}
              <Icon size={16} className={option.danger ? "text-red-500" : ""} />

              <span className="flex-1">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ChatMenu;
