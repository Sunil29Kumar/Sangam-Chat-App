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

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className="flex h-full w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-white">
      {/* LEFT SIDE: Master View */}
      <div
        className={`${selectedConversation && windowWidth < 768 ? "hidden" : "block "} w-full md:w-80 lg:w-[380px]`}
      >
        <ChatList setIsNewChatModalOpen={setIsNewChatModalOpen} />
      </div>

      {/* RIGHT SIDE: Detail View */}
      <div
        className={`${selectedConversation && windowWidth < 768 ? "block" : "hidden"} md:block flex-1  `}
      >
        <ChatWindow windowWidth={windowWidth} />
      </div>

      {/* MODALS */}
      {isNewChatModalOpen && (
        <NewChatModal setIsNewChatModalOpen={setIsNewChatModalOpen} />
      )}
    </div>
  );
};

export default Dashboard;
