import { useEffect, useState } from "react";
import Navlinks from "./componets/Navlinks";
import ChatBox from "./componets/ChatBox";
import ChatList from "./componets/ChatList";
import Login from "./componets/Login";
import Register from "./componets/Register";
// Toaster
import "./App.css";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase/firebase";

function App() {
  const [isLogin, setIsLogin] = useState(true); //users logged in status
  const [user, setUser] = useState(null); //all the info about the user ..fullname email pic ect

//state for redirecting or going to the selected users chat
 const [selectedUser, setSelectedUser] = useState(null)

  //make a call to firebase for checking for users
  useEffect(() => {
    const currentUser = auth.currentUser; //firebase method
    if (currentUser) {
      setUser(currentUser);
    }

    //whenever a user logged in or loggedout ,firebase provides a realtime listner that checks for when this operations has taken place
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />

        {user ? (
          <div className="flex lg:flex-row flex-col items-start w-[100%]">
            <Navlinks />
            <ChatList setSelectedUser={setSelectedUser} />
            <ChatBox selectedUser ={selectedUser} />
          </div>
        ) : (
          <div >
            {isLogin? <Login isLogin={isLogin} setIsLogin={setIsLogin} />  : <Register  isLogin={isLogin} setIsLogin={setIsLogin} /> } 
            {/* uses prop drilling to pass data */}
           
            
          </div>
        )}
      </div>
    </>
  );
}

export default App;
