import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { firestore, getCurrentUserId } from "@/firebase.config";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

const getUserInfo = async (docId) => {
  const usuarioRef = doc(firestore, "usuarios", docId);

  try {
    const docSnap = await getDoc(usuarioRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const dni = data.dni;
      const nombreCompleto = data.name + " " + data.surnames;
      //   console.log(data);

      return { dni, nombreCompleto };
    } else {
      console.log("No se encontró el documento");
    }
  } catch (error) {
    console.error("Error al recuperar los campos: ", error);
  }
};

const StepDNI = ({ navigation, currentStep, updateStep }) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [userData, setUserData] = useState({
    userId: "",
    nombreCompleto: "",
    dni: "",
  });
  useEffect(() => {
    if (currentStep !== 11) {
      updateStep(11);
    }
  }, [currentStep, updateStep]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("formData");
        if (data !== null) {
          const formData = JSON.parse(data);
          const userId = getCurrentUserId();
          const { dni, nombreCompleto } = await getUserInfo(userId);

          setUserData({ userId, nombreCompleto, dni });
          const reclamacionIdKey = Object.keys(formData)[1];

          const currentData = formData[reclamacionIdKey] || [];
          const updatedValue = Array.isArray(currentData)
            ? [...currentData, { dni, nombreCompleto }] // Si es un array, añade los valores al array
            : { ...currentData, ...{ dni, nombreCompleto } }; // Si es un objeto, fusiona los objetos

          const updatedData = {
            ...formData,
            [reclamacionIdKey]: updatedValue,
          };
          await AsyncStorage.setItem("formData", JSON.stringify(updatedData));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const handleNextStep = () => {
    navigation.navigate("StepConfirmarDireccion");
  };
  const handlePreviousStep = () => {
    navigation.goBack();
  };
  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Confirmanos que los siguientes datos son correctos, sino es así, escanea
        de nuevo el DNI
      </Text>
      <View style={styles.formInput}>
        <Text style={styles.formLabel}>Nombre completo:</Text>
        <Text style={styles.formReadOnly}>{userData.nombreCompleto}</Text>
      </View>
      <View style={styles.formInput}>
        <Text style={styles.formLabel}>DNI:</Text>
        <Text style={styles.formReadOnly}>{userData.dni}</Text>
      </View>
      <View style={styles.formNavigationButtonsContainer}>
        <PrimaryButton title="Siguiente" onPress={handleNextStep} />
        <SecondaryButton
          title="Escanea de nuevo el DNI"
          onPress={handlePreviousStep}
        />
      </View>
    </ScrollView>
  );
};

export default StepDNI;
