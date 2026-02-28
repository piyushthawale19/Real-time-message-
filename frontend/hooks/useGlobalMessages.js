import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import useChatStore from "@/store/chatStore";
import api from "@/lib/api";

export function useGlobalMessages() {
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !user) return;

    const handleMessage = (msg) => {
      const store = useChatStore.getState();
      const peerId =
        msg.sender.toString() === user._id.toString()
          ? msg.receiver.toString()
          : msg.sender.toString();

      store.addMessage(peerId, msg);

      const known = store.contacts.some((c) => c.user._id === peerId);
      if (!known && msg.senderData) {
        store.setContacts([
          {
            user: msg.senderData,
            lastMessage: msg.content,
            lastTime: msg.createdAt,
          },
          ...store.contacts,
        ]);
      } else {
        store.updateContactLastMessage(peerId, msg.content, msg.createdAt);
      }

      if (store.activeChat?._id === msg.sender.toString()) {
        api.patch(`/chat/messages/read/${msg.sender}`).catch(() => {});
      }

      socket.emit("message_delivered", {
        messageId: msg._id,
        toUserId: msg.sender.toString(),
      });
    };

    socket.on("new_message", handleMessage);
    return () => socket.off("new_message", handleMessage);
  }, [socket, user]);
}
