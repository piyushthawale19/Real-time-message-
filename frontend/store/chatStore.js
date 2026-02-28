import { create } from "zustand";

const useChatStore = create((set, get) => ({
  contacts: [],
  activeChat: null,
  messages: {},
  typingUsers: {},

  setContacts: (contacts) => set({ contacts }),
  setActiveChat: (user) => set({ activeChat: user }),

  addMessage: (peerId, msg) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [peerId]: [...(s.messages[peerId] ?? []), msg],
      },
    })),

  prependMessages: (peerId, older) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [peerId]: [...older, ...(s.messages[peerId] ?? [])],
      },
    })),

  setMessages: (peerId, msgs) =>
    set((s) => ({ messages: { ...s.messages, [peerId]: msgs } })),

  updateMessageStatus: (peerId, status) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [peerId]: (s.messages[peerId] ?? []).map((m) =>
          m.status !== "read" ? { ...m, status } : m,
        ),
      },
    })),

  setTyping: (userId, typing) =>
    set((s) => ({ typingUsers: { ...s.typingUsers, [userId]: typing } })),

  updateContactLastMessage: (peerId, lastMessage, lastTime) =>
    set((s) => ({
      contacts: s.contacts.map((c) =>
        c.user._id === peerId ? { ...c, lastMessage, lastTime } : c,
      ),
    })),

  updateUserPresence: (userId, patch) =>
    set((s) => ({
      contacts: s.contacts.map((c) =>
        c.user._id === userId ? { ...c, user: { ...c.user, ...patch } } : c,
      ),
      activeChat:
        s.activeChat?._id === userId
          ? { ...s.activeChat, ...patch }
          : s.activeChat,
    })),
}));

export default useChatStore;
