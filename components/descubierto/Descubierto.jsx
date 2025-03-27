import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { firestore, getCurrentUserId } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";

import StepQueEs from "./StepQueEs";
import StepComoLoSe from "./StepComoLoSe";
import StepTienesMovimientos from "./StepTienesMovimientos";
import StepSolicitarMovimientos from "./StepSolicitarMovimientos";
import StepReclamacionAhora from "./StepReclamacionAhora";
import StepBanco from "./StepBanco";
import StepCuantasCuentas from "./StepCuantasCuentas";
import StepCuantasCuentas1 from "./StepCuantasCuentas1";
import StepNumeroCuenta from "./StepNumeroCuenta";
import StepComisiones from "./StepComisiones";
import StepQuienEnvia from "./StepQuienEnvia";
import StepDNI from "./StepDNI";
import StepConfirmarDireccion from "./StepConfirmarDireccion";
import StepUploadDNI from "./StepUploadDNI";
import StepPeticionPR from "./StepPeticionPR";
import StepRevisionDocumentos from "./StepRevisionDocumentos";
import StepGenerarDocumentos from "./StepGenerarDocumentos";
import Summary from "./Summary";
import ProgressBar from "../ProgressBar";

import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";
import { Text } from "react-native";

import { NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const Descubierto = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 14;
  const route = useRoute();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  useEffect(() => {
    const currentStep = route.params?.currentStep || null;
    const claimId = route.params?.claimId || null;

    if (currentStep !== null || claimId !== null) {
      // cargar los datos al async storage y luego navegar al paso correspondiente
      const setStorage = async () => {
        try {
          const userId = getCurrentUserId();
          if (!userId) {
            Alert.alert("Usuario no autenticado. Por favor, inicia sesión.");
            return;
          } else {
            const claimRef = doc(
              firestore,
              `usuarios/${userId}/reclamaciones`,
              claimId
            );
            const querySnapshot = await getDoc(claimRef);

            // Se cargan los datos en AsyncStorage
            if (querySnapshot.exists()) {
              const data = querySnapshot.data();
              const formData = JSON.stringify({
                cantidadCuentas: 1,
                [claimId]: data,
              });
              await AsyncStorage.setItem("formData", formData);
              //   console.log(formData);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      setStorage();

      switch (currentStep) {
        case "StepBanco":
          navigation.navigate("StepBanco", { claimId });
          break;
        case "StepBanco":
          navigation.navigate("StepConfirmarDireccion", { claimId });
          break;
        case "StepPeticionPR":
          navigation.navigate("StepRevisionDocumentos", { claimId });
          break;
        default:
          break;
      }
    }

    console.log("Cargado");
  }, []);

  useEffect(() => {
    updateStep(currentStep);
  }, [currentStep]);

  const updateStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <KeyboardAvoidingView style={styles.formMainView}>
      <NavigationIndependentTree>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <Stack.Navigator
          initialRouteName="StepQueEs"
          screenOptions={{
            headerShown: false,
            animationEnabled: false,
          }}
        >
          <Stack.Screen name="StepQueEs">
            {(props) => (
              <StepQueEs
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepComoLoSe">
            {(props) => (
              <StepComoLoSe
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepTienesMovimientos">
            {(props) => (
              <StepTienesMovimientos
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepSolicitarMovimientos">
            {(props) => (
              <StepSolicitarMovimientos
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepReclamacionAhora">
            {(props) => (
              <StepReclamacionAhora
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepCuantasCuentas">
            {(props) => (
              <StepCuantasCuentas
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepCuantasCuentas1">
            {(props) => (
              <StepCuantasCuentas1
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepBanco">
            {(props) => (
              <StepBanco
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepNumeroCuenta">
            {(props) => (
              <StepNumeroCuenta
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepComisiones">
            {(props) => (
              <StepComisiones
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepQuienEnvia">
            {(props) => (
              <StepQuienEnvia
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepUploadDNI">
            {(props) => (
              <StepUploadDNI
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepDNI">
            {(props) => (
              <StepDNI
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepConfirmarDireccion">
            {(props) => (
              <StepConfirmarDireccion
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepRevisionDocumentos">
            {(props) => (
              <StepRevisionDocumentos
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepPeticionPR">
            {(props) => (
              <StepPeticionPR
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="StepGenerarDocumentos">
            {(props) => (
              <StepGenerarDocumentos
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Summary">
            {(props) => (
              <Summary
                {...props}
                currentStep={currentStep}
                updateStep={updateStep}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationIndependentTree>
    </KeyboardAvoidingView>
  );
};

export default Descubierto;
