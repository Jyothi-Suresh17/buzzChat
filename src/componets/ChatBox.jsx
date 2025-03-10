import React, { useState, useEffect, useRef, Suspense } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaRegSmile } from "react-icons/fa";
import { auth, listenForMessages, sendMessage } from "../firebase/firebase";
import { formatTimestamp } from "../utils/formatTimestand";
import { serverTimestamp } from "firebase/firestore";
import defaultAvatar from "/assets/default.jpg";
import logo from "/assets/image.png";

const EmojiPicker = React.lazy(() => import("emoji-picker-react"));

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const user1 = auth.currentUser;
  const user2 = selectedUser;
  const senderEmail = user1?.email;

  const chatId = user1?.uid && user2?.uid ? 
    (user1.uid < user2.uid ? `${user1.uid}-${user2.uid}` : `${user2.uid}-${user1.uid}`) 
    : null;

  useEffect(() => {
    if (!chatId) return;
    return listenForMessages(chatId, setMessages);
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !chatId) return;
    try {
      await sendMessage(messageText, chatId, user1?.uid, user2?.uid, serverTimestamp());
      setMessageText("");
      inputRef.current.focus();
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageText((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <>
      {selectedUser ? (
        <section className="flex flex-col h-screen w-full background-image">
          <header className="border-b border-gray-400 w-full h-[82px] p-4 bg-white flex items-center gap-3">
            <img src={selectedUser?.image || defaultAvatar} alt="User" className="w-11 h-11 object-cover rounded-full" />
            <div>
              <h3 className="font-semibold text-[#2A3D39] text-lg">{selectedUser?.fullName || "@BuzzChat User"}</h3>
              <p className="font-light text-[#2A3D39] text-sm">{"@" + selectedUser?.username || "BuzzChat"}</p>
            </div>
          </header>

          <main className="relative h-full w-full flex flex-col justify-between">
            <section className="px-3 pt-5 pb-20 lg:pb-10 overflow-auto" ref={scrollRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`flex my-4 flex-col ${msg.sender === senderEmail ? "items-end" : "items-start"}`}>
                  <div className="flex gap-3">
                    {msg.sender !== senderEmail && <img src={defaultAvatar} className="h-11 w-11 object-cover rounded-full" alt="User" />}
                    <div>
                      <div className={`p-4 rounded-lg shadow-sm ${msg.sender === senderEmail ? "bg-blue-100" : "bg-[#E6F7F8]"}`}>
                        <p className="text-gray-800 text-[17px] break-words">{msg.text}</p>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">{formatTimestamp(msg.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <div className="sticky lg:bottom-0 bottom-[60px] p-3 w-full">
              <form onSubmit={handleSendMessage} className="flex items-center bg-white h-[45px] px-2 rounded-lg shadow-lg relative">
                <button type="button" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" onClick={() => setShowPicker((prev) => !prev)}>
                  <FaRegSmile color="#01AA85" />
                </button>

                {showPicker && (
                  <div ref={pickerRef} className="absolute bottom-14 left-3 bg-white shadow-lg rounded-lg z-50">
                    <Suspense fallback={<div>Loading...</div>}>
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Suspense>
                  </div>
                )}

                <input ref={inputRef} value={messageText} onChange={(e) => setMessageText(e.target.value)} type="text" className="h-full text-[#2A3D39] outline-none text-[16px] pl-10 pr-[53px] w-full" placeholder="Type a message..." />

                <button type="submit" className="absolute right-3 p-2 me-4 rounded-full bg-[#d9f1f2] hover:bg-[#c8eae3]">
                  <RiSendPlaneFill color="#01AA85" />
                </button>
              </form>
            </div>
          </main>
        </section>
      ) : (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#E6F7F8]">
          <h1 className="text-[30px] font-bold text-teal-900 mt-5">Welcome to BuzzChat 😊</h1>
        </div>
      )}
    </>
  );
};

export default ChatBox;
