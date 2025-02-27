import React, { useEffect, useMemo, useState } from "react";
import SearchModel from "./SearchModel";
import { RiMore2Fill } from "react-icons/ri";
import { formatTimestamp } from "../utils/formatTimestand";
import { auth, listenForChats } from "../firebase/firebase";
import toast from "react-hot-toast";

const defaultAvatar = "/assets/default.jpg"; // Use direct public asset path

const ChatList = ({ setSelectedUser }) => {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
console.log(currentUser);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);
    return () => unsubscribe();
  }, []);

  // Sort chats based on last message timestamp
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTimestamp = a?.lastMessageTimestamp
        ? a.lastMessageTimestamp.seconds + a.lastMessageTimestamp.nanoseconds / 1e9
        : 0;
      const bTimestamp = b?.lastMessageTimestamp
        ? b.lastMessageTimestamp.seconds + b.lastMessageTimestamp.nanoseconds / 1e9
        : 0;
      return bTimestamp - aTimestamp;
    });
  }, [chats]);

  const startChat = (user) => {
    if (!user) return;
    setSelectedUser(user);
    toast.success("Chat started", { duration: 3000 });
  };

  return (
    <section className="relative hidden lg:flex flex-col bg-white h-[100vh] w-full md:w-[600px] border-r border-[#E0E0E0]">
      {/* Header */}
      <header className="flex items-center justify-between w-full border-b border-[#898989b9] p-4 bg-white z-[100]">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.photoURL || defaultAvatar}
            className="w-[44px] h-[44px] object-cover rounded-full"
            alt="User Avatar"
          />
          <span>
            <h3 className="font-semibold text-[#2A3D39] text-[17px]">
              {currentUser?.displayName || "BuzzChat User"}
            </h3>
            <p className="font-light text-[#2A3D39] text-[15px]">
              @{currentUser?.email?.split("@")[0] || "buzzchat"}
            </p>
          </span>
        </div>
        <button className="bg-[#D9F2ED] w-[35px] h-[35px] flex items-center justify-center rounded-lg hover:bg-[#BEE3DB] transition">
          <RiMore2Fill color="#01AA85" className="w-[24px] h-[24px]" />
        </button>
      </header>

      {/* Messages Header */}
      <div className="w-full mt-3 px-5">
        <header className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#2A3D39]">
            Messages ({chats?.length || 0})
          </h3>
          <SearchModel startChat={startChat} />
        </header>
      </div>

      {/* Chat List */}
      <main className="flex flex-col mt-4 px-5 flex-1 overflow-y-auto">
        {sortedChats.length > 0 ? (
          sortedChats.map((chat) => {
            const filteredUsers = chat?.users?.filter(
              (user) => user?.email !== auth.currentUser?.email
            );

            if (!filteredUsers || filteredUsers.length === 0) return null;

            return (
              <button
                key={chat?.id} // Ensure unique key
                className="flex items-center justify-between w-full p-3 hover:bg-[#F5F5F5] rounded-lg transition"
                onClick={() => startChat(filteredUsers[0])}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={filteredUsers[0]?.image || defaultAvatar}
                    className="h-[40px] w-[40px] rounded-full object-cover"
                    alt={filteredUsers[0]?.fullName || "BuzzChat User"}
                  />
                  <div className="text-left">
                    <h2 className="text-[15px] font-semibold text-[#2A3D39]">
                      {filteredUsers[0]?.fullName || "BuzzChat User"}
                    </h2>
                    <p className="text-[14px] text-[#6B6B6B] truncate w-[220px]">
                      {chat?.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
                <p className="text-[12px] text-[#898989]">
                  {chat?.lastMessageTimestamp ? formatTimestamp(chat.lastMessageTimestamp) : ""}
                </p>
              </button>
            );
          })
        ) : (
          <p className="text-center text-[#6B6B6B] mt-10">No chats yet</p>
        )}
      </main>
    </section>
  );
};

export default ChatList;
