import React, { useRef, useEffect, useState } from "react";
import userConversation from "../Zustans/userConversation";
import { TiMessages } from "react-icons/ti";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import {
  sendMessage,
  onReceiveMessage,
  onMessageSent,
  emitUserTyping,
  onUsersOnline,
  onUserTyping,
} from "../services/socketService";

const Message = ({ onBackUser }) => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    messages,
    selectedConversation,
    setMessage,
    isUserTyping,
    setIsUserTyping,
    clearUnread,
    incrementUnread,
    onlineUsers,
    setOnlineUsers,
  } = userConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear unread messages when conversation is selected
  useEffect(() => {
    if (selectedConversation?._id) {
      clearUnread(selectedConversation._id);
    }
  }, [selectedConversation?._id, clearUnread]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.conversationId === selectedConversation?.conversationId) {
        // If conversation is already selected, add message to state
        setMessage([
          ...messages,
          {
            _id: Math.random(),
            message: data.message,
            senderId: data.senderId,
            createdAt: data.timestamp,
          },
        ]);
      } else {
        // If this is a different conversation, mark as unread by senderId (don't auto-open)
        incrementUnread(data.senderId);
      }
    };

    onReceiveMessage(handleReceiveMessage);

    return () => {
      // Cleanup listener
    };
  }, [selectedConversation, messages, setMessage, incrementUnread]);

  // Listen for message sent confirmation
  useEffect(() => {
    const handleMessageSent = (data) => {
      if (data.conversationId === selectedConversation?._id) {
        // Message already added to state on send
      }
    };

    onMessageSent(handleMessageSent);

    return () => {
      // Cleanup listener
    };
  }, [selectedConversation]);

  // Listen for online users updates
  useEffect(() => {
    const handleUsersOnline = (data) => {
      setOnlineUsers(data);
    };

    onUsersOnline(handleUsersOnline);

    return () => {
      // Cleanup listener
    };
  }, [setOnlineUsers]);

  // Listen for typing notifications
  useEffect(() => {
    const handleUserTyping = (data) => {
      if (data.senderId === selectedConversation?._id) {
        setIsUserTyping(true);
        setTimeout(() => {
          setIsUserTyping(false);
        }, 2000);
      }
    };
    onUserTyping(handleUserTyping);
  }, [selectedConversation?._id, setIsUserTyping]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const get = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/message/${selectedConversation.conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          return;
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
      }
    };

    if (selectedConversation?.conversationId) getMessages();
  }, [selectedConversation?.conversationId, setMessage]);

  const handleMessages = (e) => {
    setSendData(e.target.value);

    // Emit typing event
    if (selectedConversation?._id) {
      emitUserTyping({
        senderId: user._id,
        receiverId: selectedConversation._id,
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const token = localStorage.getItem("token");
      // Send via HTTP to save to database
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/message/send/${selectedConversation._id}`, {
        message: sendData,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const data = await res.data;

      if (data.success === false) {
        setSending(false);
        return;
      }

      // Emit via Socket.io for real-time delivery
      sendMessage({
        senderId: user._id,
        receiverId: selectedConversation._id,
        message: sendData,
        conversationId: selectedConversation.conversationId,
      });

      setSending(false);
      setSendData("");
      setMessage([...messages, data.message]);
      setIsTyping(false);
    } catch (error) {
      setSending(false);
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-full flex flex-col ">
      {selectedConversation !== null && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            {onBackUser && (
              <button 
                onClick={onBackUser}
                className="p-2 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all sm:hidden"
                aria-label="Back to users"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            <div className="w-12 h-12 shrink-0">
              <div className="relative w-12 h-12">
                <img
                  src={selectedConversation?.profilepic || '/default-avatar.png'}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-md"
                />
                {onlineUsers?.includes(selectedConversation?._id) && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg ring-2 ring-gray-50"></span>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate">
                {selectedConversation?.username}
              </p>
              <p className="text-sm text-gray-500">
                {isUserTyping ? (
                  <span className="text-indigo-600 font-medium">typing...</span>
                ) : onlineUsers.includes(selectedConversation._id) ? (
                  "Active now"
                ) : (
                  "Active recently"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedConversation === null ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <TiMessages className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Start a conversation
              </h3>
              <p className="text-gray-500">Select a user to send a message</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <IoSend className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No messages
            </h3>
            <p className="text-gray-500 text-center">Start the conversation</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((message) => (
              <div
                key={message?._id}
                className={`flex ${message.senderId === user._id ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-md p-3 rounded-lg shadow-sm ${message.senderId === user._id
                    ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                    : "bg-gray-100 rounded-bl-none"
                    }`}
                >
                  <p
                    className={`text-sm ${message.senderId === user._id ? "font-medium" : ""
                      }`}
                  >
                    {message?.message}
                  </p>
                  <div className="flex items-center justify-end mt-1 gap-1">
                    <span
                      className={`text-xs ${message.senderId === user._id
                        ? "text-blue-200"
                        : "text-gray-500"
                        }`}
                    >
                      {new Date(message?.createdAt).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isUserTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg rounded-bl-none p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

{selectedConversation !== null && (
        <div className="sticky bottom-0 z-20 md:static p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-gray-300 focus-within:border-indigo-500 transition-colors">
              <input
                value={sendData}
                onChange={handleMessages}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 px-3 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !sendData.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl transition-all shrink-0 flex items-center justify-center"
            >
              {sending ? (
                <div className="loading loading-spinner loading-sm w-5 h-5"></div>
              ) : (
                <IoSend className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Message;
