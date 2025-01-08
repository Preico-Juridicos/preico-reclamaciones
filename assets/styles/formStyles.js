import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const formStyles = (isDarkMode) => {
  const theme = isDarkMode ? colors.dark : colors.light;

  return StyleSheet.create({
    formContainer: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      gap: 10,
    },
    formTitle: {
      fontSize: 22,
      marginBottom: 40,
      color: theme.text,
      fontFamily: "Lato_900Black",
    },
    formText: {
      fontSize: 16,
      color: theme.text,
      textAlign: "justify",
      marginBottom: 10,
      fontFamily: "Lato_400Regular",
    },
    formLabel: {
      fontSize: 16,
      marginBottom: 5,
      color: theme.text,
    },
    formInput: {
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      color: theme.text,
    },
    formError: {
      fontSize: 14,
      backgroundColor: "#ffeb3b",
      color: "#333",
      padding: 10,
      textAlign: "center",
    },
  });
};
