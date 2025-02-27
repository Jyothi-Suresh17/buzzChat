import React, { useState } from "react";
import { RiArrowDownSFill, RiBardLine, RiChatAiLine, RiFile4Line, RiFolderUserLine, RiNotificationLine, RiShutDownLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import toast from "react-hot-toast";
import image from "../../public/assets/image.png"; // Adjust based on your file structure

const Navlinks = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", { duration: 2000 });
    } catch (error) {
      toast.error("Logout failed: " + error.message, { duration: 2000 });
    }
  };

  return (
    <>
      <section className="fixed lg:static top-0 left-0 w-full lg:w-[150px] h-[9vh] lg:h-[100vh] bg-[#01a2aa] flex items-center lg:items-start lg:flex-col lg:gap-10 px-4 lg:px-0 z-50">
        {/* Logo */}
        <div className="flex items-center justify-center lg:border-b h-[81px] lg:w-full p-2 lg:p-4 lg:shadow-2xl lg:border-amber-50">
          <span className="flex items-center justify-center bg-[#c6d2d5] w-[45px] h-[45px] lg:w-[57px] lg:h-[55px]  p-0 rounded-full ">
            <img src={image} className="w-[32px]rounded-full h-[32px] lg:w-[40px] lg:h-[40px] object-contain" alt="logo" />
          </span>
        </div>

        {/* Main Navigation */}
        <ul className="flex lg:flex-col flex-row items-center justify-between w-full lg:gap-10">
          <li>
            <button className="text-[20px] lg:text-[28px] cursor-pointer">
              <RiChatAiLine color="#fff" />
            </button>
          </li>
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
          <li>
            <button className="text-[20px] lg:text-[28px] cursor-pointer">
              <RiFile4Line color="#fff" />
            </button>
          </li>
          <li>
            <button className="text-[20px] lg:text-[28px] cursor-pointer">
              <RiBardLine color="#fff" />
            </button>
          </li>
          <li>
            <button onClick={handleLogout} className="text-[20px] lg:text-[28px] cursor-pointer">
              <RiShutDownLine color="#fff" />
            </button>
          </li>

          {/* Dropdown Button for Mobile */}
          <li className="ml-2 lg:ml-0 lg:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-[20px] lg:text-[28px] cursor-pointer"
            >
              <RiArrowDownSFill color="#fff" />
            </button>
          </li>
        </ul>

        {/* Dropdown Menu for Mobile */}
        {isDropdownOpen && (
          <div className="absolute top-[9vh] left-0 bg-[#01a2aa] w-full flex flex-col items-center py-2">
            <button className="text-[20px] py-2 text-white">Profile</button>
            <button className="text-[20px] py-2 text-white">Settings</button>
            <button onClick={handleLogout} className="text-[20px] py-2 text-white">
              Logout
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Navlinks;
