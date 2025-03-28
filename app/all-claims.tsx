import React, { useEffect, useState } from "react";

import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { firestore } from "@/firebase.config";
import { collection, getDocs } from "firebase/firestore";

import Descubierto from "@components/descubierto/Descubierto";

const ModalStack = createStackNavigator();

type ClaimType = {
  id: string;
  title: string;
  icon: string;
  image: string;
  description: string;
};

export default function claims() {
  //   const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);
  const router = useRouter();

  //   const styles = createStyles(isDarkMode);
  const [claims, setClaims] = useState<ClaimType[]>([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const reclamacionesRef = collection(firestore, `tipos_reclamacion`);
        const querySnapshot = await getDocs(reclamacionesRef);

        const claimsSnapshot = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().titulo,
          icon: doc.data().icono,
          image: doc.data().url_imagen,
          description: doc.data().descripcion,
        }));
        setClaims(claimsSnapshot);
      } catch (error) {
        if ((error as Error).message.includes("offline")) {
          console.warn("El cliente está sin conexión. Reintentando...");
        } else {
          console.error("Error al obtener las reclamaciones:", error);
        }
      }
    };

    fetchClaims();
    // For Tests
    // const getBancos = async () => {
    //   const bancoRef = collection(firestore, "bancos");
    //   let bancoQuery = await getDocs(bancoRef);
    //   const bancoSnapshot = bancoQuery.docs.map((banco) => {
    //     console.log(banco.data().banco_nombre);
    //     return banco.data();
    //   });
    // };
    // getBancos();
  }, []);

  const handleCardPress = (claim: ClaimType): void => {
    router.push(`/claims/${claim.id}`);
    // setSelectedClaim(claim.id);
    // setModalVisible(true);
  };

  const renderCard = ({ item }: { item: ClaimType }) => {
    return (
      <TouchableOpacity
        style={[style.claimCard]}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={style.claimCardImage} />
        <View style={style.claimCardContent}>
          <View style={style.claimCardTitleContainer}>
            <MaterialIcons
              name={item.icon}
              size={24}
              color={style.claimCardIcon.color}
              style={style.claimCardIcon}
            />
            <Text style={style.claimCardTitle}>{item.title}</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={style.claimCardArrowIcon.color}
              style={style.claimCardArrowIcon}
            />
          </View>
          <Text style={style.claimCardDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const styles = StyleSheet.create({
    screenMainContainer: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
    },
    screenTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
      minHeight: 500,
    },
  });

  return (
    <View style={style.screenMainContainer}>
      {/* Contenido principal */}
      <Text style={style.screenTitle}>Reclamaciónes Disponibles</Text>
      <FlatList
        data={claims}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={style.ScreenContentWrapper}
      />
    </View>
  );
}
