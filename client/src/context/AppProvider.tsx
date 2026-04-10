import AuthProvider from "./AuthContext";
import ChatProvider from "./ChatContext";
import SocketProvider from "./socketContext";

export function AppProvider({children}) {
  return (
    <AuthProvider>
      <ChatProvider>
        <SocketProvider>{children}</SocketProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
