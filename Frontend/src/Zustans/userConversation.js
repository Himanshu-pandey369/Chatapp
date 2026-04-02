import { create } from "zustand";

const userConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessage: (messages) => set({ messages }),
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  isUserTyping: false,
  setIsUserTyping: (isUserTyping) => set({ isUserTyping }),
  typingUserId: null,
  setTypingUserId: (typingUserId) => set({ typingUserId }),
  unreadMessages: {},
  setUnreadMessages: (unreadMessages) => set({ unreadMessages }),
  incrementUnread: (conversationId) =>
    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [conversationId]: (state.unreadMessages[conversationId] || 0) + 1,
      },
    })),
  clearUnread: (conversationId) =>
    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [conversationId]: 0,
      },
    })),
}));

export default userConversation;
