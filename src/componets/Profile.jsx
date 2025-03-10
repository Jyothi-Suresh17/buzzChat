import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase"; // Make sure Firebase is correctly set up

const Profile = ({setShowProfile}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");


  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
    }
  }, []);

  return (
    <>
    <div className="text-center">
      <h2 className="text-xl font-bold mb-2 text-teal-900">Profile</h2>
      <p><strong className="text-t">Username:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
    <div className="flex justify-between items-center m-3 gap-4">
            <button
              onClick={() => setShowProfile(false)}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded-lg"
            >
              Update
            </button>
            <button
              onClick={() => setShowProfile(false)}
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg"
            >
              Close
            </button>
            </div>
    </>

  );
};

export default Profile;
