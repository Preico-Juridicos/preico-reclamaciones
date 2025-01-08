import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const drawerStyles = (isDarkMode) => {
  const theme = isDarkMode ? colors.dark : colors.light;

  return StyleSheet.create({
    drawerContent: {
      backgroundColor: theme.background,
    },
    drawerHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.headerBackground,
    },
    drawerLogo: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    drawerTitle: {
      fontSize: 20,
      marginLeft: 10,
      color: theme.text,
      fontWeight: "bold",
      fontVariant: ["small-caps", "common-ligatures"],
    },
    modeTogglerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    },
    modeTogglerText: {
      fontSize: 16,
      color: theme.text,
    },
  });
};