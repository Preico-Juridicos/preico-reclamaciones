import React, { useEffect, useState } from "react";

import { useNavigation } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";
import { getCurrentUserId, getUserData } from "@/firebase.config";

const homeImage = require("@/assets/images/homepick.jpg");

type UserType = {
  email: string;
  username?: string;
  address?: string;
  dni?: string;
  gender?: string;
  name?: string;
  surnames?: string;
  nationality?: string;
};
export default function home() {
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);
  const navigation = useNavigation();
  const userId = getCurrentUserId();
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const data = await getUserData(userId);
        if (data) {
          setUserData(data);
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    };
    fetchUserData();
  }, [userId]);

  const navigateToClaims = () => {
    navigation.navigate("all-claims");
  };

  const navigateToMyClaims = () => {
    navigation.navigate("my-claims");
  };

  const localStyles = StyleSheet.create({
    headerImage: {
      width: 300,
      height: 200,
      marginHorizontal: "auto",
      marginVertical: 10,
      borderRadius: 12,
    },
    contentContainer: {
      marginHorizontal: 20,
      alignItems: "center",
      marginBottom: 20,
      gap: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: 20,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: style.backgroundColorHighlight.backgroundColor,
      padding: 20,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
      width: 150,
    },
    buttonLabel: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: "600",
      color: style.text.color,
      textAlign: "center",
    },
  });
  return (
    <View style={style.screenMainContainer}>
      <View>
        <Text style={style.screenTitle}>
          {}
          {userData && userData.username != undefined
            ? "Hola, " + userData.username
            : "PREICO Reclamaciones"}
        </Text>
      </View>
      <View style={localStyles.contentContainer}>
        <Image source={homeImage} style={localStyles.headerImage} />
        <Text style={style.screenText}>
        Simplifica tus procesos de reclamaciones con las siguiente herramientas.
        </Text>
      </View>
      <View style={localStyles.contentContainer}>
        <Text style={style.screenText}>
          Aquí puedes gestionar todas tus reclamaciones de manera rápida y
          sencilla.
        </Text>
        <View style={localStyles.buttonContainer}>
          <TouchableOpacity
            style={localStyles.button}
            onPress={navigateToClaims}
          >
            <MaterialIcons name="description" size={40} color="#4A90E2" />
            <Text style={localStyles.buttonLabel}>Reclamaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={localStyles.button}
            onPress={navigateToMyClaims}
          >
            <MaterialIcons name="list-alt" size={40} color="#50C878" />
            <Text style={localStyles.buttonLabel}>Mis Reclamaciones</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
