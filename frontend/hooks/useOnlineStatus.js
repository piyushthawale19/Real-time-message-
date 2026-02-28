import { useEffect } from "react";
import useChatStore from "@/store/chatStore";
import { useSocket } from "@/context/SocketContext";

export function useOnlineStatus() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const store = useChatStore.getState;
    const onOnline = ({ userId }) =>
      store().updateUserPresence(userId, { isOnline: true });
    const onOffline = ({ userId, lastSeen }) =>
      store().updateUserPresence(userId, { isOnline: false, lastSeen });

    socket.on("user_online", onOnline);
    socket.on("user_offline", onOffline);

    return () => {
      socket.off("user_online", onOnline);
      socket.off("user_offline", onOffline);
    };
  }, [socket]);
}
