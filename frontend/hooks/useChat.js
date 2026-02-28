import { useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import useChatStore from "@/store/chatStore";
import api from "@/lib/api";

export function useChat(peerId) {
  const { socket } = useSocket();
  const { updateMessageStatus, setMessages } = useChatStore();
  const fetched = useRef({});

  useEffect(() => {
    if (!peerId || fetched.current[peerId]) return;
    fetched.current[peerId] = true;
    api
      .get(`/chat/messages/${peerId}`)
      .then((r) => setMessages(peerId, r.data.messages))
      .catch(() => {});
    api.patch(`/chat/messages/read/${peerId}`).catch(() => {});
  }, [peerId, setMessages]);

  useEffect(() => {
    if (!socket) return;

    const store = useChatStore.getState;

    const onDelivered = () =>
      peerId && store().updateMessageStatus(peerId, "delivered");
    const onTyping = ({ fromUserId }) => store().setTyping(fromUserId, true);
    const onStopTyping = ({ fromUserId }) =>
      store().setTyping(fromUserId, false);
    const onRead = () => peerId && updateMessageStatus(peerId, "read");

    socket.on("message_delivered", onDelivered);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);
    socket.on("message_read", onRead);

    return () => {
      socket.off("message_delivered", onDelivered);
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
      socket.off("message_read", onRead);
    };
  }, [socket, peerId, updateMessageStatus]);
}
