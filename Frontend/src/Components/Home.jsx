import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Message from "./Message";
import { BiLogOut } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  initializeSocket,
  joinUser,
  onUsersOnline,
  onUserTyping,
  disconnectSocket,
} from "../services/socketService";
import userConversation from "../Zustans/userConversation";

const Home = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { setOnlineUsers, setIsUserTyping, selectedConversation } =
    userConversation();

  // Initialize Socket.io connection
  useEffect(() => {
    const socket = initializeSocket();

    // Join user to socket
    if (user._id) {
      joinUser(user._id);
    }

    // Listen for online users
    onUsersOnline((onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    // Listen for typing notifications
    onUserTyping((data) => {
      if (data.senderId === selectedConversation?._id) {
        setIsUserTyping(true);
        setTimeout(() => {
          setIsUserTyping(false);
        }, 2000);
      }
    });

    return () => {
    };
  }, [user._id, selectedConversation?._id, setOnlineUsers, setIsUserTyping]);

  const handleLogOut = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const confirmlogout = window.prompt(`type username to LOGOUT`);
    if (confirmlogout === currentUser?.username) {
      setLogoutLoading(true);
      try {
        const token = localStorage.getItem("token");
        const logout = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.info(logout.data?.message);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        disconnectSocket();
        navigate("/login");
      } catch (error) {
        toast.error("Logout failed");
      } finally {
        setLogoutLoading(false);
      }
    } else {
      toast.info("Logout cancelled");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-gray-50 to-blue-50">
      <div className="flex w-full max-w-6xl mx-auto h-[90vh] rounded-xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
        <div className="w-80 md:w-96 lg:w-100 border-r border-gray-200 overflow-hidden shrink-0 relative">
          <Sidebar
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <Message />
        </div>
        {/* Classy Logout Button */}
        <button
          onClick={handleLogOut}
          disabled={logoutLoading}
          className="absolute bottom-4 right-4 p-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Logout"
        >
          <BiLogOut className="w-5 h-5" />
          <span className="hidden md:inline font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
