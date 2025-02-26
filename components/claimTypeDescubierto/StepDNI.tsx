import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { firestore, getCurrentUserId } from "@/firebase.config";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean
  ) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
  claimCode?: string;
};

const getUserInfo = async (docId: any) => {
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

const StepDNI: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [userData, setUserData] = useState({
    userId: "",
    nombreCompleto: "",
    dni: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("formData");
        if (data !== null) {
          const formData = JSON.parse(data);
          const userId = getCurrentUserId();
          if (userId) {
            const userInfo = await getUserInfo(userId);
            // console.log(userInfo);
            if (userInfo) {
              const { dni, nombreCompleto } = userInfo;
              setUserData({ userId, nombreCompleto, dni });
              const currentData = claimCode ? formData[claimCode] || [] : [];
              const updatedValue = Array.isArray(currentData)
                ? [...currentData, dni, nombreCompleto] // Si es un array, añade los valores al array
                : { ...currentData, dni, nombreCompleto }; // Si es un objeto, fusiona los objetos

              const updatedData = {
                ...formData,
                [claimCode || "defaultClaimCode"]: updatedValue,
              };
              await AsyncStorage.setItem(
                "formData",
                JSON.stringify(updatedData)
              );
            //   console.log("control");
            //   console.log({
            //     ...currentData,
            //     dni: dni,
            //     nombreCompleto: nombreCompleto,
            //   });
              updateData(
                stepId,
                { ...currentData, dni: dni, nombreCompleto: nombreCompleto },
                true
              );
            }
          }

          //   setUserData({ userId, nombreCompleto, dni });
          //   const reclamacionIdKey = Object.keys(formData)[1];

          //   const currentData = formData[reclamacionIdKey] || [];
          //   const updatedValue = Array.isArray(currentData)
          //     ? [...currentData, { dni, nombreCompleto }] // Si es un array, añade los valores al array
          //     : { ...currentData, ...{ dni, nombreCompleto } }; // Si es un objeto, fusiona los objetos

          //   const updatedData = {
          //     ...formData,
          //     [reclamacionIdKey]: updatedValue,
          //   };
          //   await AsyncStorage.setItem("formData", JSON.stringify(updatedData));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  //   const handleNextStep = () => {
  //     navigation.navigate("StepConfirmarDireccion");
  //   };
  const handlePreviousStep = () => {
    //     updateData(stepId, { ...data, reScanDNI: true });
    goToStep("11");
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
        {/* <PrimaryButton title="Siguiente" onPress={handleNextStep} /> */}
        <SecondaryButton
          title="Escanea de nuevo el DNI"
          onPress={handlePreviousStep}
        />
      </View>
    </ScrollView>
  );
};

export default StepDNI;
