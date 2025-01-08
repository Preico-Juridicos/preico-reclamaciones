import React, { useEffect, useState } from "react";

import { useNavigation } from "expo-router";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";

import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { firestore } from "@/firebase.config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getCurrentUserId } from "@/api/firebase";
// import {Descubierto} from "@components/descubierto/Descubierto";
import { Claim } from "@/models/claims";

export default function myclaims() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);

  //   const styles = createStyles(isDarkMode);

  const [myClaims, setMyClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const reclamacionesRef = collection(firestore, `tipos_reclamacion`);
        const querySnapshot = await getDocs(reclamacionesRef);

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
        if ((error as Error).message.includes("offline")) {
          console.warn("El cliente está sin conexión. Reintentando...");
        } else {
          console.error("Error al obtener las reclamaciones:", error);
        }
      }
    };

    fetchClaims();
  }, []);

  // Función para obtener las reclamaciones
  useEffect(() => {
    let isCancelled = false;

    const fetchClaims = async () => {
      const userId = getCurrentUserId();

      if (!userId) {
        console.log(
          "No se puede obtener las reclamaciones porque no hay usuario autenticado."
        );
        return;
      }

      try {
        const reclamacionesRef = collection(
          firestore,
          `usuarios/${userId}/reclamaciones`
        );
        const querySnapshot = await getDocs(reclamacionesRef);

        if (!isCancelled) {
          const claims = await Promise.all(
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
              // console.log(fecha_reclamacion);
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

          setMyClaims(claims);
        }
      } catch (error) {
        if ((error as Error).message.includes("offline")) {
          console.warn("El cliente está sin conexión. Reintentando...");
        } else {
          console.error("Error al obtener las reclamaciones:", error);
        }
      }
    };

    fetchClaims();

    return () => {
      isCancelled = true; // Cancela la operación si el efecto se desmonta.
    };
  }, []);

  const handleCardPress = (id: string): void => {
    console.log(`Formulario seleccionado: ${id}`);
    // Aquí puedes abrir el formulario correspondiente
  };

  // Manejo de navegación
  const handlePress = (claim: Claim) => {
    const claimId = claim.id;
    const currentStep = claim.currentStep;
    const currentRoute =
      navigation.getState().routes[navigation.getState().index];

    switch (
      currentRoute.name
      //   case "Inicio":
      //     navigation.navigate("Mis Reclamaciones", {
      //       screen: "DescubiertoSummary",
      //       params: { claimId, currentStep },
      //     });
      //     break;
      //   case "MyClaims":
      //     navigation.navigate("DescubiertoSummary", { claimId, currentStep });
      //     break;
    ) {
    }
  };

  const renderCard = ({ item }: { item: Claim }) => {
    // console.log("item", item);
    return (
      <View style={styles.container}>
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => handlePress(item)}
        >
          <Image
              source={{ uri: item.logo }}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={styles.container}>
        {myClaims.length > 0 ? (
          myClaims.map((claim) => (
            <TouchableOpacity
              key={claim.id}
              style={styles.card}
              onPress={() => handlePress(claim)}
            >
              {claim.tipo === "descubierto" && (
                <Image
                  //   source={require("../assets/images/150x150 descubierto.png")}
                  style={styles.image}
                />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.cardText}>
                  {(claim.tipo ?? "").toString().charAt(0).toUpperCase() +
                    (claim.tipo ?? "").toString().slice(1)}{" "}
                  ({claim.entidadBancariaName})
                </Text>
                <Text style={styles.dateText}>
                  {/* Conversión de fecha */}
                  {claim.fecha_reclamacion &&
                  claim.fecha_reclamacion.seconds &&
                  claim.fecha_reclamacion.nanoseconds
                    ? (() => {
                        const { seconds, nanoseconds } =
                          claim.fecha_reclamacion;
                        const milliseconds =
                          seconds * 1000 + Math.floor(nanoseconds / 1e6);
                        const fecha = new Date(milliseconds);
                        return fecha.toLocaleDateString(); // Formato local, ej. dd/MM/yyyy
                      })()
                    : "Fecha no disponible"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noClaimsText}>No hay reclamaciones</Text>
        )}
      </View>
    );
  };

  return (
    <View style={style.screenMainContainer}>
      <Text style={style.screenTitle}>Reclamaciónes Disponibles</Text>
      <FlatList
        data={myClaims}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={style.ScreenContentWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f4f4f4",
    padding: 10,
    // backgroundColor: "#f2e8cf"
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
    flexDirection: "row", // Establecer flexDirection para alinear imagen y texto
    alignItems: "center", // Centrar verticalmente
  },
  image: {
    width: 50, // Ancho de la imagen
    height: 50, // Alto de la imagen
    marginRight: 15, // Espacio entre la imagen y el texto
    borderRadius: 10,
  },
  textContainer: {
    flex: 1, // Permite que el texto ocupe el espacio restante
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
