import { app } from "firebase.config.ts";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

const getCurrentUserId = () => {
  const user = auth.currentUser;

  if (user) {
    return user.uid;
  } else {
    console.log("No hay usuario autenticado.");
    return null;
  }
};

export { auth, getCurrentUserId };
