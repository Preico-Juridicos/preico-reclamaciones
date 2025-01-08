import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  //   ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
// import { createStackNavigator } from "@react-navigation/stack";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  //   Timestamp,
} from "firebase/firestore";
import { firestore, getCurrentUserId } from "../constants/firebaseConfig";
// import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native"; // Mantén este hook


const MyClaims = () => {
  const [myClaims, setMyClaims] = useState([]);
  const navigation = useNavigation();

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
          const claims = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMyClaims(claims);
        }
      } catch (error) {
        if (error.message.includes("offline")) {
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

  // Función para obtener el nombre de una entidad bancaria
  const getEntidadBancariaName = async (entidadBancaria) => {
    try {
      const bancosRef = doc(firestore, "bancos", entidadBancaria);
      const querySnapshot = await getDoc(bancosRef);

      if (querySnapshot.exists()) {
        const entidadBancariaData = querySnapshot.data();
        return (
          entidadBancariaData.banco_nombre_comercial ||
          entidadBancariaData.banco_nombre
        );
      }
    } catch (error) {
      console.error(
        "Error al obtener el nombre de la entidad bancaria:",
        error
      );
    }
    return entidadBancaria;
  };

  // Actualizar las reclamaciones con los nombres de entidades bancarias
  useEffect(() => {
    const fetchEntidadBancariaNames = async () => {
      try {
        const updatedClaims = await Promise.all(
          myClaims.map(async (claim) => {
            if (claim.entidadBancaria) {
              const entidadBancariaName = await getEntidadBancariaName(
                claim.entidadBancaria
              );
              return { ...claim, entidadBancariaName };
            }
            return claim;
          })
        );
        setMyClaims(updatedClaims);
      } catch (error) {
        console.error("Error al procesar entidades bancarias:", error);
      }
    };

    if (myClaims.length > 0) {
      fetchEntidadBancariaNames();
    }
  }, [myClaims]);

  // Manejo de navegación
  const handlePress = (claim) => {
    const claimId = claim.id;
    const currentStep = claim.currentStep;
    const currentRoute =
      navigation.getState().routes[navigation.getState().index];

    switch (currentRoute.name) {
      case "Inicio":
        navigation.navigate("Mis Reclamaciones", {
          screen: "DescubiertoSummary",
          params: { claimId, currentStep },
        });
        break;
      case "MyClaims":
        navigation.navigate("DescubiertoSummary", { claimId, currentStep });
        break;
    }
  };
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
                source={require("../assets/images/150x150 descubierto.png")}
                style={styles.image}
              />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>
                {claim.tipo.toString().charAt(0).toUpperCase() +
                  claim.tipo.toString().slice(1)}{" "}
                ({claim.entidadBancariaName})
              </Text>
              <Text style={styles.dateText}>
                {/* Conversión de fecha */}
                {claim.fecha_reclamacion &&
                claim.fecha_reclamacion.seconds &&
                claim.fecha_reclamacion.nanoseconds
                  ? (() => {
                      const { seconds, nanoseconds } = claim.fecha_reclamacion;
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

export default MyClaims;
