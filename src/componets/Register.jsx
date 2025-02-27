import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const Register = ({ isLogin, setIsLogin }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userData.fullName || !userData.email || !userData.password) {
      toast.error("All fields are required!", { duration: 3000 });
      setLoading(false);
      return;
    }

    try {
      const emailLower = userData.email.toLowerCase();

      // Check if the email already exists in Firestore
      const userRef = doc(db, "users", emailLower);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        toast.error("Email already registered!");
        setLoading(false);
        return;
      }

      // Firebase Auth - Register User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailLower,
        userData.password
      );
      const user = userCredential.user;

      // Set display name in Firebase Auth
      await updateProfile(user, { displayName: userData.fullName });

      // Add user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: emailLower,
        username: emailLower.split("@")[0],
        fullName: userData.fullName,
        image: "",
        createdAt: serverTimestamp(),
      });

      toast.success("Registration Successful!", { duration: 3000 });
      setUserData({ fullName: "", email: "", password: "" });

      // Redirect to login page
      setIsLogin(true);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email is already in use. Try logging in.");
      } else {
        toast.error(error.message || "Registration Failed!");
      }
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center background-image">
      <div className="shadow-lg bg-white rounded-xl p-5 h-[27rem] w-[24rem] flex flex-col justify-center items-center">
        <div className="mb-10">
          <h1 className="text-center text-[28px] font-bold">Sign Up</h1>
          <p className="text-center text-sm text-gray-400">
            Welcome, Create an account to continue
          </p>
        </div>
        <form className="w-full">
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChangeUserData}
            className="border-blue-200 w-full p-2 rounded-md bg-[#01a7aa1d] text-[#004939f3] focus:outline-none focus:ring-2 focus:ring-[#3289768a] mb-3 font-medium placeholder:text-[#003d4958]"
            placeholder="Enter your Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChangeUserData}
            className="border-blue-200 w-full p-2 rounded-md bg-[#01a7aa1d] text-[#004939f3] focus:outline-none focus:ring-2 focus:ring-[#3289768a] mb-3 font-medium placeholder:text-[#003d4958]"
            placeholder="Enter your Email"
            autoComplete="email"
            required
          />
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChangeUserData}
            className="border-blue-200 w-full p-2 rounded-md bg-[#01a7aa1d] text-[#004939f3] focus:outline-none focus:ring-2 focus:ring-[#3289768a] mb-3 font-medium placeholder:text-[#003d4958]"
            autoComplete="new-password"
            placeholder="Enter your password"
            required
          />
          <button
            disabled={loading}
            onClick={handleAuth}
            className={`bg-[#1d8995ec] flex justify-center items-center gap-2 text-white p-2 rounded-md w-full font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#003e49]"
            }`}
          >
            {loading ? <>Processing .....</> : <>Register<FaUserPlus /></>}
          </button>
        </form>
        <div className="mt-5 text-center text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
};

export default Register;
