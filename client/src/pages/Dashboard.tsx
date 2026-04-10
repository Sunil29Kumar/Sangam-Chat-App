import {useState} from "react";
import ChatList from "../components/dashboard/chat/chat-list/ChatList";
import ChatWindow from "../components/dashboard/chat/chat-window/ChatWindow";
import NewChatModal from "../components/dashboard/chat/chatModel/NewChatModal";

const Dashboard = () => {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  return (
    <div className="flex h-full w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-white">
      {/* LEFT SIDE: Master View */}
      <ChatList setIsNewChatModalOpen={setIsNewChatModalOpen} />

      {/* RIGHT SIDE: Detail View */}
      <ChatWindow />

      {/* MODALS */}
      {isNewChatModalOpen && (
        <NewChatModal setIsNewChatModalOpen={setIsNewChatModalOpen} />
      )}
    </div>
  );
};

export default Dashboard;
