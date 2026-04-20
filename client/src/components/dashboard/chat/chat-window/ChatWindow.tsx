import {MessageSquare, Phone, Video, MoreVertical} from "lucide-react";
import {ChatContext} from "../../../../context/ChatContext";
import {useContext, useEffect, useRef, useState} from "react";
import {useSocket} from "../../../../hooks/useSocket";
import {AuthContext} from "../../../../context/AuthContext";
import MessageInputContainer from "./MessageInputContainer";
import MessageArea from "./MessageArea";

const ChatWindow = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const {socket} = useSocket();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  let typingTimeout: any;

  if (!chatContext) return null;

  const {
    selectedConversation,
    getMessages,
    messages,
    setMessages,
    setIsTyping,
    setTypingStatus,
  } = chatContext;

  if (!authContext) return null;
  const {user} = authContext;

  // Selected conversation change hone pe messages fetch karne hai
  useEffect(() => {
    if (selectedConversation?._id) {
      getMessages(selectedConversation._id);
    }
  }, [selectedConversation?._id]);

  // Socket se new message receive hone pe messages update karne hai
  useEffect(() => {
    if (!socket) return;
    socket.on("new_message", (message: any) => {
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => {
      socket.off("new_message");
    };
  }, [socket, selectedConversation?._id, setMessages]);

  // Messages update hone pe scroll karna hai
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

  // handle Typing status
  const handleTyping = () => {
    socket?.emit("typing", {
      conversationId: selectedConversation._id,
      senderName: user.name,
    });

    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket?.emit("stop_typing", {conversationId: selectedConversation._id});
    }, 2000);
  };

  // 2. Listen for Typing Status (useEffect mein)
  useEffect(() => {
    socket?.on("display_typing", (data) => {
      setIsTyping(true);
      setTypingStatus(`${data.senderName} typing...`);
    });

    socket?.on("hide_typing", () => {
      setIsTyping(false);
      setTypingStatus("");
    });

    return () => {
      socket?.off("display_typing");
      socket?.off("hide_typing");
    };
  }, [socket]);

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
    <div className=" flex-1 flex flex-col bg-white h-screen max-h-screen overflow-hidden">
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
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all">
            <Phone size={19} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all">
            <Video size={19} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all">
            <MoreVertical size={19} />
          </button>
        </div>
      </div>

      {/* --- Messages Area --- */}
      <MessageArea scrollRef={scrollRef as React.RefObject<HTMLDivElement>} messages={messages} user={user} />

      {/* --- Message Input Container --- */}

      <MessageInputContainer
        text={text}
        setText={setText}
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
      />
    </div>
  );
};

export default ChatWindow;
