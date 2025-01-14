import React from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import HomeScreen from "@app/home";
import InitialScreen from "@app/auth/initial";
import { getCurrentUserId } from "@/firebase.config";

const App = () => {
  const userId = getCurrentUserId();
  if (!userId) {
    return <InitialScreen />;
  } else {
    return <HomeScreen />;
  }
};

export default App;
