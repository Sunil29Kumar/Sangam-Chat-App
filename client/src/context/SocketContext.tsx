import {createContext, useContext, useEffect, useState} from "react";
import {AuthContext} from "./AuthContext";
import {io, Socket} from "socket.io-client";

interface socketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

export const SocketContext = createContext<socketContextType | null>(null);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const authContext = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  if (!authContext) return null;
  const {user} = authContext;

  // get online users
  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        query: {userId: (user as any)._id},
        withCredentials: true,
        transports: ["websocket", "polling"], // Only use WebSocket transport
      });

      setSocket(newSocket);

      // Online users track karne ke liye (Backend se aayega)
      newSocket.on("get_online_users", (users) => {
        console.log("online users", users);
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close(); 
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{socket, onlineUsers}}>
      {children}
    </SocketContext.Provider>
  );
}
