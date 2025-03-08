import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { RiSearchLine } from "react-icons/ri";
import defaultAvatar from "../../public/assets/default.jpg";
import toast from "react-hot-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const SearchModel = ({ startChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUsers([]); // Clear previous search results
  };

  // Searching users in Firestore
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("⚠️ Warning: Please enter a search term!", { duration: 3000 });
      return;
    }

    try {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const q = query(
        collection(db, "users"),
        where("username", ">=", normalizedSearchTerm),
        where("username", "<=", normalizedSearchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const foundUsers = [];

      querySnapshot.forEach((doc) => {
        foundUsers.push({ id: doc.id, ...doc.data() });
      });

      setUsers(foundUsers);

      if (foundUsers.length === 0) {
        toast.error("⚠️ Warning: No users found!", { duration: 3000 });
      }
    } catch (error) {
      toast.error("Error: " + error.message, { duration: 3000 });
    }
  };

  return (
    <>
      <div>
        {/* Search Button */}
        <button
          onClick={openModal}
          className="lg:bg-[#D9F2ED] w-[35px] h-[35px] flex items-center justify-center rounded-lg"
        >
<RiSearchLine className="w-[22px] h-[22px] flex items-center text-white sm:text-[#01AA85]" />
</button>

        {/* Search Modal */}
        {isModalOpen && (
          <div
            onClick={closeModal}
            className="fixed inset-0 z-[100] flex justify-center items-center bg-[#0f6e7d9f]"
          >
            <div
              className="relative p-4 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-[#01a2aa] w-[100%] shadow-lg rounded-md">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 sm:p-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-white">
                    Search Chats
                  </h3>
                  <button
                    onClick={closeModal}
                    className="end-2.5 text-white bg-transparent hover:bg-[#d9f2ed] hover:text-[#01a4aa] text-sm w-8 h-8 ms-auto rounded-lg inline-flex items-center justify-center"
                  >
                    <FaXmark size={20} />
                  </button>
                </div>

                {/* Search Input Field */}
                <div className="p-4 md:p-5">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        className="bg-white border-b-gray-300 text-gray-900 w-full p-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-[#01AA85] focus:border-[#01AA85]"
                        placeholder="Search by username..."
                      />
                      <button
                        onClick={handleSearch}
                        className="bg-[#33df6c] hover:bg-[#1a9f4e] text-white px-3 py-2 rounded-lg"
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="mt-6">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          startChat(user);
                          closeModal();
                        }}
                        className="flex items-start gap-3 mt-5 bg-[#30f4fb34] p-2.5 rounded-lg cursor-pointer border border-[#ffffff20] shadow-lg"
                      >
                        <img
                          src={user.image || defaultAvatar}
                          alt=""
                          className="h-[40px] w-[40px] rounded-full"
                        />
                        <span>
                          <h2 className="text-white font-semibold text-[18px] p-0">
                            {user.fullName}
                          </h2>
                          <p className="text-white text-[13px]">@{user.username}</p>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchModel;
