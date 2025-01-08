import React from "react";

import { useNavigation } from "expo-router";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";

import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, Avatar, Icon } from "@rneui/themed";
import { MaterialIcons } from "@expo/vector-icons";
// import {Descubierto} from "@components/descubierto/Descubierto";
const claimsDescubierto =
  "https://firebasestorage.googleapis.com/v0/b/preico-auto-app-dev.appspot.com/o/Images%2FclaimsDescubierto.png?alt=media&token=6e2d4462-0a87-4567-b247-fe2938808f38";

type FormType = {
  id: string;
  title: string;
  icon: string;
  image: string;
  description: string;
};

const formTypes: FormType[] = [
  {
    id: "1",
    title: "Reclamación por Descubierto",
    icon: "warning",
    image: "https://via.placeholder.com/150",
    description: "Reclama cargos por descubierto en tu cuenta bancaria.",
  },
  {
    id: "2",
    title: "Reclamación por Comisiones Indebidas",
    icon: "money-off",
    image: "https://via.placeholder.com/150",
    description:
      "Reclama comisiones que consideres indebidas en tu cuenta bancaria.",
  },
  {
    id: "3",
    title: "Reclamación por Tarjetas no Solicitadas",
    icon: "credit-card",
    image: "https://via.placeholder.com/150",
    description: "Reporta tarjetas de crédito o débito que no has solicitado.",
  },
  {
    id: "4",
    title: "Reclamación por Cobros Duplicados",
    icon: "receipt",
    image: "https://via.placeholder.com/150",
    description: "Solicita la devolución de cargos duplicados en tu cuenta.",
  },
  {
    id: "5",
    title: "Reclamación por Negativa de Crédito",
    icon: "block",
    image: "https://via.placeholder.com/150",
    description: "Reclama si se te ha negado un crédito injustamente.",
  },
  {
    id: "6",
    title: "Reclamación por Información Errónea",
    icon: "info",
    image: "https://via.placeholder.com/150",
    description:
      "Corrige errores en los datos o informes proporcionados por el banco.",
  },
];

export default function claims() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  //   const styles = createStyles(isDarkMode);

  const claims = [
    {
      id: "1",
      title: "Descubierto",
      description:
        "Presiona aquí para empezar tu reclamación por descubierto bancario",
      image: claimsDescubierto,
      component: "Descubierto",
      icon: "touch-app",
    },
  ];
  //   const renderCards = ({
  //     item,
  //   }: {
  //     item: {
  //       id: string;
  //       title: string;
  //       description: string;
  //       image: string;
  //       component: string;
  //       icon: string;
  //     };
  //   }) => (
  //     <TouchableOpacity onPress={() => console.log(item.component)}>
  //       <Card
  //         containerStyle={localstyle.claimsCardContainer}
  //         wrapperStyle={localstyle.claimsCardWrapper}
  //       >
  //         <Card.Title>{item.title}</Card.Title>
  //         <MaterialIcons
  //           name={item.icon}
  //           size={24}
  //           style={localstyle.claimsCardIcon}
  //         />
  //         <Image source={{ uri: item.image }} style={styles.claimsCover} />
  //         <Card.FeaturedSubtitle style={{ color: "red" }}>
  //           {item.description}
  //         </Card.FeaturedSubtitle>
  //       </Card>
  //     </TouchableOpacity>
  //   );

  //   return (
  //     <View style={styles.mainContainer}>
  //       <Text style={localstyle.title}>Reclamaciónes Disponibles</Text>

  //       <FlatList
  //         data={claims}
  //         renderItem={renderCards}
  //         keyExtractor={(item) => item.id}
  //         // style={styles.claims}
  //       />
  //     </View>
  //   );

  const handleCardPress = (id: string): void => {
    console.log(`Formulario seleccionado: ${id}`);
    // Aquí puedes abrir el formulario correspondiente
  };

  const renderCard = ({ item }: { item: FormType }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCardPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <MaterialIcons name={item.icon} size={24} color="#4A90E2" />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <Text style={localstyle.title}>Reclamaciónes Disponibles</Text>

      <FlatList
        data={claims}
        renderItem={renderCards}
        keyExtractor={(item) => item.id}
        // style={styles.claims}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3, // Para sombra en Android
    shadowColor: "#000", // Para sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
const localstyle = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A4A48",
    textAlign: "right",
    marginTop: 35,
    marginRight: 20,
    marginBottom: 20,
  },
  claimsCardContainer: {
    backgroundColor: "#f2e8cf",
    borderRadius: 10,
    padding: 0,
    marginHorizontal: 20,
    position: "relative",
  },
  claimsCardWrapper: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2e8cf",
    margin: 0,
  },
  claimsCardIcon: {
    position: "absolute",
    zIndex: 1,
    top: -15,
    right: -15,
    padding: 10,
    backgroundColor: "#f2e8cf",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#f232cf",
  },
  //   menuButton: {
  //     width: Dimensions.get("window").width * 0.8,
  //     paddingVertical: 20,
  //     borderRadius: 10,
  //     alignItems: "center",
  //     marginVertical: 10,
  //   },
  //   menuButtonPrimary: {
  //     backgroundColor: "#4A4A48",
  //   },
  //   menuButtonSecondary: {
  //     backgroundColor: "#6b6b6b",
  //   },
  //   menuButtonText: {
  //     color: "#ffffff",
  //     fontSize: 18,
  //     fontWeight: "bold",
  //     textTransform: "uppercase",
  //   },
});
