import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import { firestore, getCurrentUserId } from "@/firebase.config";

const StepPeticionPR = ({ navigation, currentStep, updateStep }) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const [cantidadCuentas, setCantidadCuentas] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("formData");
        if (data) {
          const formData = JSON.parse(data);
          setCantidadCuentas(formData.cantidadCuentas || 1);
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentStep !== 13) {
      updateStep(13);
    }
  }, [currentStep, updateStep]);

  const handleSubmitPN = async () => {
    try {
      const userId = getCurrentUserId();

      if (!userId) {
        Alert.alert("Error", "No se pudo obtener el usuario actual.");
        return;
      }

      const data = await AsyncStorage.getItem("formData");
      if (!data) {
        Alert.alert("Error", "No se encontraron datos en AsyncStorage.");
        return;
      }

      const formData = JSON.parse(data);
      //   console.log(formData);
      const reclamacionId = Object.keys(formData)[1]; // Obtener el ID del primer elemento

      if (!reclamacionId) {
        Alert.alert("Error", "No se pudo obtener el ID de la reclamación.");
        return;
      }
      //   console.log(reclamacionId);
      const currentData = formData[reclamacionId] || [];
      const updatedValue = Array.isArray(currentData)
        ? [...currentData, { hasPR: false, currentStep: "StepPeticionPR" }] // Si es un array, añade los valores al array
        : {
            ...currentData,
            ...{ hasPR: false, currentStep: "StepPeticionPR" },
          }; // Si es un objeto, fusiona los objetos

      const docRef = doc(
        firestore,
        `usuarios/${userId}/reclamaciones`,
        reclamacionId
      );
      await setDoc(
        docRef,
        {
          ...updatedValue,
        },
        { merge: true }
      );

      //   console.log("Reclamación actualizada/creada");

      Alert.alert(
        "Petición Enviada",
        cantidadCuentas === 1
          ? "Hemos enviando la petición a tu correo. Por favor vuelve cuando la tengas firmada."
          : "Hemos enviando la petición a tu correo. Por favor vuelve cuando la tengas firmada. Ahora procederemos con la siguiente cuenta."
      );

      if (cantidadCuentas > 1) {
        delete formData[reclamacionId];
        await AsyncStorage.setItem("formData", JSON.stringify(formData));
        const newCantidadCuentas = cantidadCuentas - 1;
        setCantidadCuentas(newCantidadCuentas);
        await updateCantidadCuentasInStorage(newCantidadCuentas);
        navigation.navigate("StepBanco");
      } else {
        await AsyncStorage.removeItem("formData");
        navigation.navigate("Inicio");
      }
    } catch (error) {
      console.error("Error al enviar la petición:", error);
      Alert.alert("Error", "Hubo un problema al enviar la petición.");
    }
  };

  const updateCantidadCuentasInStorage = async (newCantidadCuentas) => {
    try {
      const data = await AsyncStorage.getItem("formData");
      if (data) {
        const formData = JSON.parse(data);
        const updatedData = {
          ...formData,
          cantidadCuentas: newCantidadCuentas,
        };
        await AsyncStorage.setItem("formData", JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error("Error updating AsyncStorage:", error);
    }
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>Petición poder representativo</Text>
      <Text style={styles.formText}>
        Necesitamos tu autorización para poder enviar la petición. Usamos un
        sistema seguro de firmas online para ello.
      </Text>
      <View style={{ gap: 10, marginTop: 10 }}>
        <PrimaryButton onPress={handleSubmitPN} title="Enviame la petición" />
        <SecondaryButton title="Mejor Luego" onPress={handleGoHome} />
        <SecondaryButton title="Atrás" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

export default StepPeticionPR;
