import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAASlzXFfi09eR2jRBtnulIOVUdPX6YwFU",
  authDomain: "preico-auto-app-dev.firebaseapp.com",
  projectId: "preico-auto-app-dev",
  storageBucket: "preico-auto-app-dev.appspot.com",
  messagingSenderId: "405929246902",
  appId: "1:405929246902:web:859aaac4640ed937026617",
  measurementId: "G-H55P75L5ZG",
  databaseURL:
    "preico-auto-app-dev-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const firestore = getFirestore(app);
const database = getDatabase(app);

const getCurrentUserId = () => {
  const user = auth.currentUser;

  if (user) {
    return user.uid;
  } else {
    return null;
  }
};

export { app, auth, firestore, database, getCurrentUserId };
