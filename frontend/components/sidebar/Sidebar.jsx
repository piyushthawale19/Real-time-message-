"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useChatStore from "@/store/chatStore";
import ConversationItem from "./ConversationItem";
import UserSearchModal from "./UserSearchModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Sidebar({ mobileOpen, onClose }) {
  const { contacts, activeChat, setActiveChat } = useChatStore();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleSelect = (u) => {
    setActiveChat(u);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        className={`
          fixed md:relative z-50 md:z-auto inset-y-0 left-0
          w-[85%] max-w-xs md:w-80 md:max-w-none
          flex flex-col bg-panel border-r border-white/[0.06] flex-shrink-0
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-semibold text-sm text-white shadow-glow">
              {user?.displayName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm text-white leading-none">
                {user?.displayName}
              </p>
              <p className="text-[11px] text-muted mt-0.5">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(true)}
              title="New chat"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-white hover:bg-white/[0.06] transition-all duration-200"
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <line x1="12" y1="8" x2="12" y2="14" />
                <line x1="9" y1="11" x2="15" y2="11" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-400/[0.08] transition-all duration-200"
              title="Logout"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Search hint */}
        <div className="px-4 pb-3">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-muted text-sm hover:bg-white/[0.06] transition-colors duration-200"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search or start a chat
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto scrollbar-none py-1.5">
          {contacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center pt-20 px-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-muted"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-muted text-sm font-medium">No conversations</p>
              <p className="text-muted-dark text-xs mt-1">
                Start a new chat to begin messaging
              </p>
              <button
                onClick={() => setShowSearch(true)}
                className="mt-4 text-primary text-sm font-medium hover:text-primary-light transition-colors"
              >
                New conversation
              </button>
            </motion.div>
          ) : (
            contacts.map((c, i) => (
              <motion.div
                key={c.user._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              >
                <ConversationItem
                  contact={c}
                  active={activeChat?._id === c.user._id}
                  onClick={() => handleSelect(c.user)}
                />
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence>
          {showSearch && (
            <UserSearchModal onClose={() => setShowSearch(false)} />
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}
