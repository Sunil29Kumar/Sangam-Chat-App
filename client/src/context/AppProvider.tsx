import AuthProvider from "./AuthContext";
import ChatProvider from "./ChatContext";
import SocketProvider from "./SocketContext";

export function AppProvider({children }: {children: React.ReactNode}) {
  return (
    <AuthProvider>
      <ChatProvider>
        <SocketProvider>{children}</SocketProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
