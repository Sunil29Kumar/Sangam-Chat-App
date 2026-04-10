import {
  Send,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Smile,
} from "lucide-react";
import { ChatContext } from "../../../../context/ChatContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../../hooks/useSocket";
import { AuthContext } from "../../../../context/AuthContext";

const ChatWindow = () => {
  const chatContext = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!chatContext) return null;
  const { selectedConversation, getMessages, messages, setMessages } = chatContext;

  useEffect(() => {
    if (selectedConversation?._id) {
      getMessages(selectedConversation._id);
    }
  }, [selectedConversation?._id]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new_message", (message: any) => {
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => { socket.off("new_message"); };
  }, [socket, selectedConversation?._id, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!text.trim() || !selectedConversation) return;
    const messageData = {
      senderId: user._id,
      content: text,
      conversationId: selectedConversation._id,
    };
    socket?.emit("send_message", messageData);
    setText("");
  };

  if (!selectedConversation) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto border border-slate-100">
            <MessageSquare size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Sangam Chat</h3>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            Select a friend to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-screen max-h-screen overflow-hidden">
      {/* --- Chat Header --- */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-md z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation?.otherParticipant?.name}`}
              className="w-11 h-11 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm object-cover"
              alt="avatar"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">
              {selectedConversation?.otherParticipant?.name}
            </h4>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-0.5">
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"><Phone size={19} /></button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"><Video size={19} /></button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"><MoreVertical size={19} /></button>
        </div>
      </div>

      {/* --- Messages Area --- */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa] custom-scrollbar scroll-smooth"
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isMe = msg.sender === user._id || msg.senderId === user._id;
            return (
              <div
                key={msg._id || index}
                className={`flex items-end gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-[14.5px] font-medium leading-relaxed shadow-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-none shadow-indigo-100/50"
                      : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`text-[9px] mt-1.5 block font-bold uppercase tracking-tighter opacity-70 ${
                      isMe ? "text-right" : ""
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
             <MessageSquare size={40} className="mb-2 opacity-20" />
             <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">End-to-end encrypted</p>
          </div>
        )}
      </div>

      {/* --- Message Input Container --- */}
      <div className="px-6 py-4 bg-white border-t border-slate-50 py-10">

        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100/80 p-1.5 pl-4 rounded-[1.8rem] focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:bg-white focus-within:border-indigo-100 border-2 border-transparent transition-all shadow-inner">

          <button className="text-slate-400 hover:text-indigo-500 p-2 transition-colors">
            <Smile size={22} />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] font-semibold text-slate-700 py-2.5 placeholder:text-slate-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!text.trim()}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-90 ${
                text.trim() 
                ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Send size={18} fill={text.trim() ? "currentColor" : "none"} className={text.trim() ? "ml-0.5" : ""} />
          </button>
        </div>

        {/* Helper text for safety */}
        <p className="text-center text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-[0.1em]">
          Press Enter to send
        </p>

      </div>

    </div>
  );
};

export default ChatWindow;