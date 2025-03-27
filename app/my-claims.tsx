import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import { firestore } from "@/firebase.config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getCurrentUserId } from "@/api/firebase";
import { Claim } from "@/models/claims";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyClaims() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);

  const [myClaims, setMyClaims] = useState<Claim[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClaims = useCallback(async () => {
    try {
      const userId = await getCurrentUserId();
      const reclamacionesRef = collection(firestore, `usuarios/${userId}/reclamaciones`);
      const querySnapshot = await getDocs(reclamacionesRef);

      if (querySnapshot.empty) {
        setMyClaims([]);
        return;
      }

      const claimsSnapshot = await Promise.all(
        querySnapshot.docs.map(async (claim) => {
          let fecha_reclamacion = new Date();
          if (claim.data().fecha_reclamacion) {
            fecha_reclamacion = new Date(claim.data().fecha_reclamacion.seconds * 1000);
            fecha_reclamacion.setMilliseconds(claim.data().fecha_reclamacion.nanoseconds / 1e6);
          }

          const bancoRef = doc(firestore, "bancos", claim.data().entidadBancaria);
          const banco = await getDoc(bancoRef);
          const bancoNombre = banco.exists()
            ? banco.data().banco_nombre_comercial || banco.data().banco_nombre
            : "";

          return {
            id: claim.id,
            entidadBancaria: claim.data().entidadBancaria,
            dni: claim.data().dni,
            tipo: claim.data().tipo,
            currentStep: claim.data().currentStep ?? null,
            fecha_reclamacion,
            logo: banco.data()?.banco_logo ?? null,
            banco_nombre: bancoNombre,
          };
        })
      );

      setMyClaims(claimsSnapshot);
    } catch (error) {
      console.log("Error al obtener las reclamaciones:", error);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const onRefresh = useCallback(() => {
    console.log("Refreshing...");
    setRefreshing(true);
    fetchClaims().finally(() => setRefreshing(false));
  }, [fetchClaims]);

  const handlePress = (claim: Claim) => {
    router.push({
      pathname: `/claims/${claim.tipo}`,
      params: { claimCode: claim.id, claimStep: claim.currentStep },
    });
  };

  const renderCard = ({ item }: { item: Claim }) => (
    <TouchableOpacity style={style.myClaimCardContainer} onPress={() => handlePress(item)}>
      {item.logo && <Image source={{ uri: item.logo }} style={style.myClaimLogo} />}
      <View style={style.myClaimCardTextContainer}>
        <Text style={style.myClaimCardText}>
          {(item.tipo ?? "").charAt(0).toUpperCase() + (item.tipo ?? "").slice(1)} a {item.banco_nombre}
        </Text>
        <Text style={style.myClaimCardDateText}>
          {item.fecha_reclamacion ? item.fecha_reclamacion.toLocaleDateString() : "Fecha no disponible"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={style.screenMainContainer}>
      <Text style={style.screenTitle}>Mis Reclamaciones</Text>
      <SafeAreaView style={{ flex: 1 }}>
        {myClaims.length > 0 ? (
          <FlatList
            data={myClaims}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={style.ScreenContentWrapper}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        ) : (
          <Text style={style.formError}>Aún no tienes reclamaciones</Text>
        )}
      </SafeAreaView>
    </View>
  );
}
