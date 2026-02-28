"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import useChatStore from "@/store/chatStore";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

export default function MessageInput({ peerId }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  const {
    addMessage,
    updateContactLastMessage,
    contacts,
    setContacts,
    activeChat,
  } = useChatStore();
  const isTypingRef = useRef(false);
  const textareaRef = useRef(null);

  const emitStopTyping = useDebounce(() => {
    if (!isTypingRef.current) return;
    socket?.emit("stop_typing", { toUserId: peerId });
    isTypingRef.current = false;
  }, 1500);

  const handleChange = (e) => {
    setText(e.target.value);
    // Auto-resize
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 128) + "px";
    }
    if (!isTypingRef.current && socket) {
      socket.emit("typing", { toUserId: peerId });
      isTypingRef.current = true;
    }
    emitStopTyping();
  };

  const sendMessage = async () => {
    const content = text.trim();
    if (!content || sending) return;

    const optimistic = {
      _id: `opt-${Date.now()}`,
      sender: user._id,
      receiver: peerId,
      content,
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    addMessage(peerId, optimistic);

    const known = contacts.some((c) => c.user._id === peerId);
    if (!known && activeChat) {
      setContacts([
        {
          user: activeChat,
          lastMessage: content,
          lastTime: optimistic.createdAt,
        },
        ...contacts,
      ]);
    } else {
      updateContactLastMessage(peerId, content, optimistic.createdAt);
    }
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (isTypingRef.current) {
      socket?.emit("stop_typing", { toUserId: peerId });
      isTypingRef.current = false;
    }

    try {
      setSending(true);
      await api.post("/chat/messages", { receiverId: peerId, content });
    } catch {
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSend = text.trim().length > 0 && !sending;

  return (
    <div className="px-4 md:px-6 py-3 bg-panel/80 backdrop-blur-xl border-t border-white/[0.06]">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-sm placeholder-muted resize-none focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all duration-200 max-h-32 overflow-y-auto leading-relaxed"
          />
        </div>
        <motion.button
          whileHover={{ scale: canSend ? 1.05 : 1 }}
          whileTap={{ scale: canSend ? 0.95 : 1 }}
          onClick={sendMessage}
          disabled={!canSend}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5
            transition-all duration-200
            ${
              canSend
                ? "bg-gradient-to-br from-primary to-primary-dark text-white shadow-glow"
                : "bg-white/[0.04] text-muted-dark"
            }
          `}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
