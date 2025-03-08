import React, { useState, useEffect, useMemo, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { auth, listenForMessages, sendMessage } from "../firebase/firebase";
import { formatTimestamp } from "../utils/formatTimestand";
import defaultAvatar from "../../public/assets/default.jpg";
import logo from "../../public/assets/image.png";
import { serverTimestamp } from "firebase/firestore";
// import EmojiPicker from "emoji-picker-react"; // Import Emoji Picker

const EmojiPicker = React.lazy(() => import("emoji-picker-react"));


const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showPicker, setShowPicker] = useState(false); // State for emoji picker
  const scrollRef = useRef(null);

  const user1 = auth.currentUser;
  const user2 = selectedUser;
  const senderEmail = user1?.email;

  // Generate unique chat ID
  const chatId = useMemo(() => {
    if (user1?.uid && user2?.uid) {
      return user1.uid < user2.uid ? `${user1.uid}-${user2.uid}` : `${user2.uid}-${user1.uid}`;
    }
    return null;
  }, [user1, user2]);

  // Listen for messages
  useEffect(() => {
    if (!chatId) return;
    return listenForMessages(chatId, setMessages);
  }, [chatId]);

  // Scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Sort messages by timestamp
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTimestamp = a.timestamp?.seconds + a.timestamp?.nanoseconds / 1e9 || 0;
      const bTimestamp = b.timestamp?.seconds + b.timestamp?.nanoseconds / 1e9 || 0;
      return aTimestamp - bTimestamp;
    });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return alert("Message cannot be empty!");

    if (!chatId) {
      console.error("Error: chatId is undefined or invalid.");
      return;
    }

    try {
      await sendMessage(messageText, chatId, user1?.uid, user2?.uid, serverTimestamp());
      setMessageText(""); // Clear input
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  // Handle adding emojis to input
  const handleEmojiClick = (emojiObject) => {
    setMessageText((prev) => prev + emojiObject.emoji);
    setShowPicker(false); // Close picker after selecting emoji
  };

  return (
    <>
      {selectedUser ? (
        <section className="flex flex-col items-start justify-start h-screen w-full background-image">
          {/* Header */}
          <header className="border-b border-gray-400 w-full h-[82px] p-4 bg-white">
            <div className="flex items-center gap-3">
              <img
                src={selectedUser?.image || defaultAvatar}
                alt="User"
                className="w-11 h-11 object-cover rounded-full"
              />
              <div>
                <h3 className="font-semibold text-[#2A3D39] text-lg">
                  {selectedUser?.fullName || "@BuzzChat User"}
                </h3>
                <p className="font-light text-[#2A3D39] text-sm">
                  {"@" + selectedUser?.username || "BuzzChat"}
                </p>
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <main className="custom-scrollbar relative h-full w-full flex flex-col justify-between">
            <section className="px-3 pt-5 pb-20 lg:pb-10">
              <div ref={scrollRef} className="overflow-auto h-[80vh]">
                {sortedMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex my-4 flex-col ${msg.sender === senderEmail ? "items-end" : "items-start"}`}
                  >
                    <div className="flex gap-3 me-12 h-auto">
                      {msg.sender !== senderEmail && (
                        <img src={defaultAvatar} className="h-11 w-11 object-cover rounded-full" alt="User" />
                      )}
                      <div>
                        <div
                          className={`p-4 rounded-lg shadow-sm ${
                            msg.sender === senderEmail ? "bg-blue-100" : "bg-[#E6F7F8]"
                          }`}
                        >
                          <p className="font-medium text-[17px] text-gray-800 break-words">
                            {msg.text}
                          </p>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Message Input */}
            <div className="sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-full">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center bg-white h-[45px] w-full px-2 rounded-lg shadow-lg relative"
              >
                {/* Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl"
                >
                  😀
                </button>

                {/* Emoji Picker */}
                {showPicker && (
                  <div className="absolute bottom-12 left-3 bg-white shadow-lg rounded-lg">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                {/* Message Input */}
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  type="text"
                  className="h-full text-[#2A3D39] outline-none text-[16px] pl-10 pr-[53px] rounded-lg w-full"
                  placeholder="Type a message..."
                />

                {/* Send Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center absolute right-3 p-2 me-4 rounded-full bg-[#d9f1f2] hover:bg-[#c8eae3]"
                >
                  <RiSendPlaneFill color="#01AA85" />
                </button>
              </form>
            </div>
          </main>
        </section>
      ) : (
        
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#E6F7F8]">
          <div className="rounded-full p-6 bg-[#cccccc]">
            <img src={logo} alt="BuzzChat Logo" className="w-28 h-28" />
          </div>
          <h1 className="text-[30px] font-bold text-teal-900 mt-5">
            Welcome to BuzzChat 😊
          </h1>
          <p className="text-gray-600">Join the conversation and connect with others</p>
        </div>
      )}
    </>
  );
};

export default ChatBox;
