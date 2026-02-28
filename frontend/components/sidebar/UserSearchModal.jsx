"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import useChatStore from "@/store/chatStore";
import { useDebounce } from "@/hooks/useDebounce";

export default function UserSearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setActiveChat, contacts, setContacts } = useChatStore();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const doSearch = useDebounce(async (q) => {
    if (!q.trim()) return setResults([]);
    setLoading(true);
    try {
      const res = await api.get("/users/search", { params: { q } });
      setResults(res.data.users);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleChange = (e) => {
    setQuery(e.target.value);
    doSearch(e.target.value);
  };

  const openChat = (user) => {
    const exists = contacts.some((c) => c.user._id === user._id);
    if (!exists) {
      setContacts([{ user, lastMessage: null, lastTime: null }, ...contacts]);
    }
    setActiveChat(user);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[60] flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-panel rounded-2xl shadow-soft-xl w-full max-w-md overflow-hidden border border-white/[0.06]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="relative">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search by name or email..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white placeholder-muted text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="max-h-80 overflow-y-auto scrollbar-none">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <p className="text-center text-muted text-sm py-8">
              No users found
            </p>
          )}
          {!loading && !query && (
            <p className="text-center text-muted-dark text-sm py-8">
              Type to search users
            </p>
          )}
          {results.map((user, i) => (
            <motion.button
              key={user._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              onClick={() => openChat(user)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors text-left"
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center font-semibold text-sm text-white">
                  {user.displayName?.[0]?.toUpperCase()}
                </div>
                {user.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-panel bg-emerald-400 animate-pulse-soft" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
