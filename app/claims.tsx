import React, { useEffect, useState } from "react";

import { useNavigation } from "expo-router";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { firestore } from "@/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import Descubierto from "@components/descubierto/Descubierto";

type ClaimType = {
  id: string;
  title: string;
  icon: string;
  image: string;
  description: string;
};

export default function claims() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);
  const [com, setCom] = useState<React.ReactElement | null>(null);

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
  }, []);

  const handleCardPress = (id: string): void => {
      switch (id) {
          case 'descubierto':
            console.log(`Formulario seleccionado: ${id}`);
            // navigation.navigate("Descubierto");
            setCom(<Descubierto />);
            break;
    
        default:
            break;
    }
    // Aquí puedes abrir el formulario correspondiente
  };

  const renderCard = ({ item }: { item: ClaimType }) => {
    return (
      <TouchableOpacity
        style={[style.claimCard]}
        onPress={() => handleCardPress(item.id)}
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

  return (
    <View style={style.screenMainContainer}>
      <Text style={style.screenTitle}>Reclamaciónes Disponibles</Text>
      <FlatList
        data={claims}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={style.ScreenContentWrapper}
      />
      {com}
    </View>
  );
}
