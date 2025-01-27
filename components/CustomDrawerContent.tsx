import React, { useEffect, useState } from "react";
import { View, Text, Switch, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { auth } from "@api/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getCurrentUserId } from "@/firebase.config";

export default function CustomDrawerContent(props: any) {
  const { isDarkMode, toggleTheme } = useTheme();
  const style = createStyles(isDarkMode);
  const userId = getCurrentUserId();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      props.navigation.reset({ index: 0, routes: [{ name: "auth/initial" }] });
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      props.navigation.reset({ index: 0, routes: [{ name: "auth/initial" }] });
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Image
            style={{ height: 50, width: 50 }}
            source={require("../assets/images/plogo.png")}
          />
          <Text style={style.headerLogo}>PREICO Reclamaciones</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        label="Ajustes"
        onPress={() => props.navigation.navigate("user/[id]")}
        labelStyle={{
          ...style.drawerItemText,
          color:
            props.state?.routes[props.state.index]?.name === "user/[id]"
              ? style.drawerItemActiveText.color
              : style.drawerItemText.color,
        }}
        icon={({ size }) => {
          const isFocused =
            props.state?.routes[props.state.index]?.name === "user/[id]"; // No debería estar activo normalmente
          return (
            <MaterialIcons
              name="settings"
              color={
                isFocused
                  ? style.drawerItemActiveText.color
                  : style.drawerItemText.color
              }
              size={size}
            />
          );
        }}
        style={{
          display: !userId ? "none" : "flex",
          paddingLeft: 10,
          borderRadius: 0,
          backgroundColor:
            props.state?.routes[props.state.index]?.name === "user/[id]"
              ? style.drawerItemActive.backgroundColor
              : "transparent",
        }}
      />
      <DrawerItem
        label={!userId ? "Iniciar sesión" : "Cerrar sesión"}
        onPress={!userId ? handleSignIn : handleSignOut}
        labelStyle={style.drawerItemText}
        icon={({ size }) => (
          <FontAwesome
            name="sign-out"
            color={style.drawerItemText.color}
            size={size}
          />
        )}
        style={{ paddingLeft: 10 }}
      />
      <TouchableOpacity
        style={style.modeTogglerContainer}
        onPress={toggleTheme}
      >
        <MaterialIcons
          name={isDarkMode ? "light-mode" : "dark-mode"}
          color={style.drawerItemText.color}
          size={24}
        />
        <Text style={style.modeTogglerText}>
          {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
