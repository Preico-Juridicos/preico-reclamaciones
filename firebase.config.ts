import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Firestore, getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
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
const storage = getStorage(app);

// Define el tipo UserType
type UserType = {
  email: string;
  username?: string;
  address?: string;
  dni?: string;
  gender?: string;
  name?: string;
  surnames?: string;
  nationality?: string;
  postalCode?: string;
  whoSends?: string;
  hasPR?: boolean;
  hasPN?: boolean;
};

// Funciones
const getCurrentUserId = () => {
  const user = auth.currentUser;

  if (user) {
    return user.uid;
  } else {
    return null;
  }
};
// Función para obtener los datos del usuario
const getUserData = async (userId: string): Promise<UserType | null> => {
  try {
    if (!userId) {
      return null;
    } else {
      const userRef = doc(firestore, `usuarios/${userId}`);
      const userDoc = await getDoc(userRef);

      // Se cargan los datos en AsyncStorage
      if (userDoc.exists()) {
        return userDoc.data() as UserType;
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  app,
  auth,
  firestore,
  database,
  storage,
  getCurrentUserId,
  getUserData,
};
