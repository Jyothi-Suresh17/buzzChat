import React from "react";
import {
  RiFolderUserLine,
  RiNotificationLine,
  RiShutDownLine,
} from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import toast from "react-hot-toast";
import image from "../../public/assets/image.png"; // Adjust path if needed
import SearchModel from "./SearchModel";

const Navlinks = ({ setSelectedUser }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", { duration: 2000 });
    } catch (error) {
      toast.error("Logout failed: " + error.message, { duration: 2000 });
    }
  };

  const startChat = (user) => {
    if (!user) return;
    setSelectedUser(user);
    toast.success("Chat started", { duration: 3000 });
  };

  return (
    <>
      <section className="fixed lg:static top-0 left-0 w-full lg:w-[150px] h-[9vh] lg:h-[100vh] bg-[#01a2aa] flex items-center lg:items-start lg:flex-col lg:gap-10 px-4 lg:px-0 z-50">
        {/* Logo */}
        <div className="flex items-center justify-center lg:border-b h-[81px] lg:w-full p-2 lg:p-4 lg:shadow-2xl lg:border-amber-50">
          <span className="flex items-center justify-center bg-[#c6d2d5] w-[45px] h-[45px] lg:w-[57px] lg:h-[55px] p-0 rounded-full">
            <img
              src={image}
              className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] object-contain"
              alt="logo"
            />
          </span>
        </div>

        {/* Navigation */}
        <ul className="flex lg:flex-col flex-row items-center w-full px-4 lg:px-0 flex-grow">
          {/* Icons at the start */}
          <div className="flex items-center gap-8 lg:flex-col lg:gap-10">
            <li>
              <button className="text-[20px] lg:text-[28px] cursor-pointer">
                <RiFolderUserLine color="#fff" />
              </button>
            </li>
            <li>
              <button className="text-[20px] lg:text-[28px] cursor-pointer">
                <RiNotificationLine color="#fff" />
              </button>
            </li>
          </div>

          {/* Search icon */}
          <div className="flex items-center gap-10 ms-3 mt-0 mb-1 lg:flex-col lg:gap-10">
            <li>
              <button className="text-[20px] lg:text-[28px] lg:hidden cursor-pointer">
                <SearchModel startChat={startChat} />
              </button>
            </li>
          </div>

          {/* Logout Button (End on small, Bottom on large) */}
          <li className="flex-1 flex justify-end lg:justify-center lg:absolute lg:bottom-4 w-full">
            <button
              onClick={handleLogout}
              className="text-[20px] lg:text-[28px] cursor-pointer"
            >
              <RiShutDownLine color="#fff" />
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Navlinks;
