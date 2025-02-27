import { initializeApp } from "firebase/app";
import { 
  collection, 
  doc, 
  getDoc, 
  getFirestore, 
  onSnapshot, 
  serverTimestamp, 
  setDoc, 
  updateDoc, 
  addDoc 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDopigIzbGpt06zBwwXkUMXBT3DH09emTw",
  authDomain: "buzz-chat-app-1f2b9.firebaseapp.com",
  projectId: "buzz-chat-app-1f2b9",
  storageBucket: "buzz-chat-app-1f2b9.appspot.com",  // ✅ Fixed Storage Bucket
  messagingSenderId: "68680269537",
  appId: "1:68680269537:web:1bb4239d1c6180176b41a0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Listen for chat updates in Firestore
 * @param {Function} setChats - Function to update chat state
 * @returns {Function} Unsubscribe function for cleanup
 */
export const listenForChats = (setChats) => {
  const chatsRef = collection(db, "chats");

  const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
    if (!auth.currentUser) return; // ✅ Prevents crash if user is not logged in

    const chatList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredChats = chatList.filter((chat) =>
      chat?.users?.some((user) => user.email === auth.currentUser.email)
    );

    setChats(filteredChats);
  });

  return unsubscribe; // ✅ Unsubscribe function for cleanup
};

/**
 * Send a message to a chat
 * @param {string} messageText - Message content
 * @param {string} chatId - ID of the chat document
 * @param {string} user1 - ID of the first user
 * @param {string} user2 - ID of the second user
 */
export const sendMessage = async (messageText, chatId, user1, user2) => {
  try {
    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      return;
    }

    const chatRef = doc(db, "chats", chatId);

    // ✅ Ensure Firestore user IDs are being fetched correctly
    const user1Ref = doc(db, "users", user1);
    const user2Ref = doc(db, "users", user2);
    const user1Doc = await getDoc(user1Ref);
    const user2Doc = await getDoc(user2Ref);

    if (!user1Doc.exists() || !user2Doc.exists()) {
      console.error("One or both users not found in Firestore.");
      return;
    }

    const user1Data = user1Doc.data();
    const user2Data = user2Doc.data();

    // ✅ Check if chat exists, if not create a new chat document
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        users: [user1Data, user2Data],
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
      });
    } else {
      await updateDoc(chatRef, {
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
      });
    }

    // ✅ Add message to subcollection inside chat
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: messageText,
      sender: auth.currentUser.email,
      timestamp: serverTimestamp(),
    });

    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

//function for realtime chat between two users

export const listenForMessages = (chatId, setMessages) => {
  const chatRef = collection(db, "chats", chatId, "messages");
  const unsubscribe = onSnapshot(chatRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id, // Store message ID if needed
      ...doc.data(),
    }));
    setMessages(messages);
  });

  return unsubscribe; // ✅ Cleanup when component unmounts
};

export { auth, db };
