"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useChatStore from "@/store/chatStore";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/hooks/useChat";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export default function ChatWindow({ onBack }) {
  const { activeChat, messages, typingUsers, prependMessages } = useChatStore();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const topRef = useRef(null);
  const scrollRef = useRef(null);

  const peerId = activeChat?._id;
  const peerMessages = messages[peerId] ?? [];
  const isTyping = typingUsers[peerId];

  useChat(peerId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [peerMessages.length, isTyping]);

  const loadOlder = useCallback(async () => {
    if (!peerMessages.length) return;
    const oldest = peerMessages[0]?.createdAt;
    try {
      const res = await api.get(`/chat/messages/${peerId}`, {
        params: { before: oldest },
      });
      if (res.data.messages.length) prependMessages(peerId, res.data.messages);
    } catch {}
  }, [peerId, peerMessages, prependMessages]);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadOlder();
      },
      { threshold: 1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadOlder]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col h-screen bg-surface-900"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 bg-panel/80 backdrop-blur-xl border-b border-white/[0.06] relative z-10">
        {/* Mobile back */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-white hover:bg-white/[0.06] transition-all -ml-1 mr-1"
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>

        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-semibold text-sm text-white shadow-glow">
            {activeChat?.displayName?.[0]?.toUpperCase()}
          </div>
          {activeChat?.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-panel flex items-center justify-center">
              <span className="w-full h-full rounded-full bg-emerald-400 animate-pulse-soft" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-white leading-none truncate">
            {activeChat?.displayName}
          </p>
          <p className="text-[11px] text-muted mt-1">
            {activeChat?.isOnline ? (
              <span className="text-emerald-400">online</span>
            ) : activeChat?.lastSeen ? (
              `last seen ${formatDistanceToNow(new Date(activeChat.lastSeen), { addSuffix: true })}`
            ) : (
              ""
            )}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-1.5"
      >
        <div ref={topRef} className="h-1" />
        <AnimatePresence initial={false}>
          {peerMessages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={msg.sender === user._id}
            />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {isTyping && <TypingIndicator name={activeChat?.displayName} />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <MessageInput peerId={peerId} />
    </motion.div>
  );
}
