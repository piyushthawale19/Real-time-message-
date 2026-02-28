"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import useChatStore from "@/store/chatStore";
import api from "@/lib/api";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useGlobalMessages } from "@/hooks/useGlobalMessages";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { activeChat, setContacts } = useChatStore();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useOnlineStatus();
  useGlobalMessages();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/chat/contacts")
      .then((res) => setContacts(res.data.contacts))
      .catch(() => {});
  }, [user, setContacts]);

  useEffect(() => {
    if (activeChat) setMobileSidebar(false);
  }, [activeChat]);

  if (loading || !user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      <Sidebar
        mobileOpen={mobileSidebar}
        onClose={() => setMobileSidebar(false)}
      />

      <AnimatePresence mode="wait">
        {activeChat ? (
          <ChatWindow
            key="chat"
            onBack={() => {
              useChatStore.getState().setActiveChat(null);
              setMobileSidebar(true);
            }}
          />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 hidden md:flex flex-col items-center justify-center bg-surface-900"
          >
            <div className="flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="text-primary"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Pulse Messenger
              </h2>
              <p className="text-muted text-sm max-w-xs leading-relaxed">
                Select a conversation or start a new chat to begin messaging
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile FAB to open sidebar when no chat is active */}
      {!activeChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileSidebar(true)}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-glow flex items-center justify-center z-30"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
