import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import userConversation from "../Zustans/userConversation";

const Sidebar = ({ selectedUserId, setSelectedUserId, setIsSidebarVisible }) => {
  const [currentuser, setCurrentuser] = useState(null);
  const [searchInput, setsearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatUser, setChatUser] = useState([]);
  const [SearchUser, setSearchuser] = useState([]);
  const {
    messages,
    setMessage,
    selectedConversation,
    setSelectedConversation,
    unreadMessages,
  } = userConversation();
  const navigate = useNavigate();

const handleUserClick = (user) => {
    setSelectedUserId(user.username);
    setSelectedConversation(user);
    if (typeof window !== 'undefined' && window.innerWidth < 640 && setIsSidebarVisible) {
      setIsSidebarVisible(false);
    }
  };

  useEffect(() => {
    const owner = JSON.parse(localStorage.getItem("user"));
    if (owner) {
      setCurrentuser(owner.name);
    }
  }, []);

  const loadChatUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/currentchatters`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setChatUser(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Failed to load chats");
    }
  };

  useEffect(() => {
    loadChatUsers();
  }, []);

  const handSearchback = () => {
    setSearchuser([]);
    setsearchInput("");
  };

  const handlesearchsubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const search = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/search?search=${searchInput}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const data = search.data;
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Search failed");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b font-bold text-xl text-gray-800">
        Hello {currentuser}
      </div>

      <form
        onSubmit={handlesearchsubmit}
        className="p-4 border-b flex gap-2 w-full"
      >
        <input
          value={searchInput}
          onChange={(e) => setsearchInput(e.target.value)}
          type="text"
          required
          placeholder="🔍 Search user..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? "..." : "Find"}
        </button>
      </form>

      {SearchUser?.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-2 w-full">
            {SearchUser.map((user) => (
              <div
                key={user._id}
                className="p-4 cursor-pointer hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 rounded-2xl mb-3 border border-gray-200/50 shadow-sm hover:shadow-md hover:border-indigo-200 flex items-center gap-4 transition-all duration-300 overflow-hidden group relative"
                onClick={() => handleUserClick(user)}
              >
                <div className="w-12 h-12 bg-linear-to-r from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-white font-semibold text-lg">
                    <div className="relative w-12 h-12">
                      <img
                        src={user.profilepic}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 text-lg truncate">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{user.name}</p>
                </div>
                {/* Green dot for unread messages */}
                {unreadMessages[user._id] > 0 && (
                  <div className="ml-2 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4">
          {chatUser.length === 0 ? (
            <div className="font-bold flex flex-col items-center text-xl text-gradient-to-r from-amber-500 to-orange-500 text-center mt-20 gap-2">
              <h1 className="text-2xl">Why are you Alone!! 🤔</h1>
              <h1 className="text-lg">Search people's to start a conversation</h1>
            </div>
          ) : (
            chatUser.map((user) => (
              <div
                key={user._id}
                className="p-4 cursor-pointer rounded-2xl mb-3 border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-indigo-200 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 transition-all duration-300 group overflow-hidden relative"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex">
                  <div className="w-12 h-12 bg-linear-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <div className="relative w-12 h-12">
                      {/* Profile Image */}
                      <img
                        src={user.profilepic}
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                      />

                      {/* Online Indicator */}
                      {user.isOnline && (
                        <span className="absolute top-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pl-4">
                    <p className="font-bold text-gray-900 text-lg truncate group-hover:text-indigo-700 transition-colors">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {user.name || "No name"}
                    </p>
                  </div>
                  {/* Green dot for unread messages */}
                  {unreadMessages[user._id] > 0 && (
                    <div className="ml-2 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {SearchUser?.length > 0 && (
        <button
          onClick={handSearchback}
          className="mx-4 mb-4 px-6 py-3 bg-linear-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          ← Back to chats
        </button>
      )}
    </div>
  );
};

export default Sidebar;
