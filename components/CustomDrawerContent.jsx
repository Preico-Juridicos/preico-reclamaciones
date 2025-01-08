import React from "react";
import { View, Text, Switch, Image } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { useTheme } from "../contexts/ThemeContext";
import { createStyles } from "../constants/styles";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { auth } from "../constants/firebaseConfig";

const CustomDrawerContent = (props) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const styles = createStyles(isDarkMode);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      props.navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerContent}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
    >
      {/* Header */}
      <View style={styles.drawerHeader}>
        <Image
          source={require("../assets/plogo.png")}
          style={styles.drawerLogo}
        />
        <Text style={styles.drawerTitle}>Preico Auto APP</Text>
      </View>

      {/* Drawer Items */}
      <View>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Ajustes"
          onPress={() => props.navigation.navigate("Ajustes")}
          labelStyle={{ color: styles.title.color }}
          icon={({ color, size }) => <MaterialIcons name="settings" color={color} size={size} />}
        />
        <DrawerItem
          label="Cerrar sesión"
          onPress={handleSignOut}
          labelStyle={{ color: styles.title.color }}
          icon={({ color, size }) => <FontAwesome name="sign-out" color={color} size={size} />}
        />
      </View>

      {/* Footer */}
      <View style={styles.modeTogglerContainer}>
        <Text style={styles.modeTogglerText}>Modo Oscuro</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
