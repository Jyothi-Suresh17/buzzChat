import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { FaSignInAlt } from "react-icons/fa";
import { auth } from '../firebase/firebase';
import toast from 'react-hot-toast';

const Login = ({ setIsLogin, isLogin }) => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: name === "email" ? value.toLowerCase() : value, // Convert email to lowercase
    }));
  };

  const handleAuth = async (e) => {
    e.preventDefault(); // Prevent form reload
    setIsLoading(true);

    if (!userData.email || !userData.password) {
      toast.error("Both fields are required!", { duration: 3000 });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
      toast.success("Logged in Successfully", { duration: 3000 });
    } catch (error) {
      let errorMessage = "Login Failed. Please check your credentials.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "User not found. Please sign up.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Try again.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Try again later.";
          break;
        case "auth/user-disabled":
          errorMessage = "Your account has been disabled. Contact support.";
          break;
        default:
          errorMessage = "Something went wrong. Try again.";
      }

      toast.error(errorMessage, { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center background-image">
      <div className="shadow-lg bg-white rounded-xl p-5 h-[27rem] w-[24rem] flex flex-col justify-center items-center">
        <div className="mb-10">
          <h1 className="text-center text-[28px] font-bold">Sign In</h1>
          <p className="text-center text-sm text-gray-400">
            Welcome back, Login to continue
          </p>
        </div>
        <form className="w-full" onSubmit={handleAuth}>
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
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
          <button
            type="submit"
            className="bg-[#1d8995ec] flex justify-center items-center gap-2 text-white p-2 rounded-md w-full font-medium hover:bg-[#003e49] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? <span className="loader"></span> : <>Login <FaSignInAlt /></>}
          </button>
        </form>
        <div className="mt-5 text-center text-gray-400">
          New Here?{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:text-blue-700">
            Create
          </button>{" "}
          an account
        </div>
      </div>
    </section>
  );
};

export default Login;
