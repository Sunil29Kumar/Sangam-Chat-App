import {useContext, useEffect, useState} from "react";
import ChatList from "../components/dashboard/chat/chat-list/ChatList";
import ChatWindow from "../components/dashboard/chat/chat-window/ChatWindow";
import NewChatModal from "../components/dashboard/chat/chatModel/NewChatModal";
import {useAuth} from "../hooks/useAuth";
import {ChatContext} from "../context/ChatContext";

const Dashboard = () => {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const {checkAuthentication} = useAuth();
  const chatAuth = useContext(ChatContext);
  const {selectedConversation} = chatAuth;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ✅ Fix: resize listener add kiya — warna width kabhi update nahi hogi
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div className="flex h-full w-full bg-white  shadow-xl overflow-hidden border border-white">
      <div
        className={`
          ${isMobile && selectedConversation ? "hidden" : "flex"}
          w-full md:w-70 lg:w-80 shrink-0
        `}
      >
        <ChatList setIsNewChatModalOpen={setIsNewChatModalOpen} />
      </div>

      <div
        className={`
          ${isMobile && !selectedConversation ? "hidden" : "flex"}
          flex-1 min-w-0
        `}
      >
        <ChatWindow />
      </div>

      {isNewChatModalOpen && (
        <NewChatModal setIsNewChatModalOpen={setIsNewChatModalOpen} />
      )}
    </div>
  );
};

export default Dashboard;
