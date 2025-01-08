import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const screenStyles = (isDarkMode) => {
  const theme = isDarkMode ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.text,
      textAlign: "center",
    },
    menuButton: {
      width: "80%",
      paddingVertical: 20,
      borderRadius: 10,
      alignItems: "center",
      marginVertical: 10,
    },
    menuButtonPrimary: {
      backgroundColor: theme.color,
    },
    menuButtonSecondary: {
      backgroundColor: theme.backgroundColorHighlight,
    },
    menuButtonText: {
      color: theme.buttonTextPrimary,
      fontSize: 18,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  });
};
