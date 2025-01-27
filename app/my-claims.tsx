import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { firestore } from "@/firebase.config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getCurrentUserId } from "@/api/firebase";
import { Claim } from "@/models/claims";

export default function myclaims() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);

  const [myClaims, setMyClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const reclamacionesRef = collection(firestore, `tipos_reclamacion`);
        const querySnapshot = await getDocs(reclamacionesRef);

        if (querySnapshot.empty) {
          setMyClaims([]);
          return;
        }

        const claimsSnapshot = await Promise.all(
          querySnapshot.docs.map(async (claim) => {
            let fecha_reclamacion = new Date();
            if (claim.data().fecha_reclamacion) {
              fecha_reclamacion = new Date(
                claim.data().fecha_reclamacion.seconds * 1000
              );
              fecha_reclamacion.setMilliseconds(
                claim.data().fecha_reclamacion.nanoseconds / 1e6
              );
            }
            const bancoRef = doc(
              firestore,
              "bancos",
              claim.data().entidadBancaria
            );
            let banco = await getDoc(bancoRef);
            return {
              id: claim.id,
              entidadBancaria: claim.data().entidadBancaria,
              dni: claim.data().dni,
              tipo: claim.data().tipo,
              currentStep: claim.data().currentStep ?? null,
              fecha_reclamacion: fecha_reclamacion,
              logo: banco?.data()?.banco_logo ?? null,
            };
          })
        );
        setMyClaims(claimsSnapshot);
      } catch (error) {
        console.log("Error al obtener las reclamaciones:", error);
      }
    };

    fetchClaims();
  }, []);

  const handlePress = (claim: Claim) => {
    const claimId = claim.id;
    const currentStep = claim.currentStep;
    const currentRoute =
      navigation.getState().routes[navigation.getState().index];

    switch (currentRoute.name) {
      // Implementar lógica de navegación según sea necesario
    }
  };

  const renderCard = ({ item }: { item: Claim }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => handlePress(item)}
    >
      {item.logo && <Image source={{ uri: item.logo }} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.cardText}>
          {(item.tipo ?? "").toString().charAt(0).toUpperCase() +
            (item.tipo ?? "").toString().slice(1)}{" "}
          ({item.entidadBancaria})
        </Text>
        <Text style={styles.dateText}>
          {item.fecha_reclamacion
            ? item.fecha_reclamacion.toLocaleDateString()
            : "Fecha no disponible"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={style.screenMainContainer}>
      <Text style={style.screenTitle}>Mis Reclamaciones</Text>
      {myClaims.length > 0 ? (
        <FlatList
          data={myClaims}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={style.ScreenContentWrapper}
        />
      ) : (
        <Text style={style.formError}>Aún no tienes reclamaciones</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    maxWidth: 375,
    height: 100,
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ffefdb",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#777",
  },
  noClaimsText: {
    fontSize: 16,
    color: "#ff4d4d",
    textAlign: "center",
    marginTop: 20,
  },
});
