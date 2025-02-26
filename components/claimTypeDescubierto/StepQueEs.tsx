import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";
import { useFocusEffect, useRouter } from "expo-router";
import { getCurrentUserId } from "@/firebase.config";

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
};

const StepQueEs: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const router = useRouter();

  useFocusEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      console.error("No hay usuario autenticado");
      router.push("/");
      return;
    }
  });

  useEffect(() => {
    setCanContinue(true);
  }, []);

  //   const handleNextStep = () => {
  //     // updateStep(2);
  //     navigation.navigate("StepComoLoSe");
  //   };

  //   const handleGoHome = () => {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "Inicio" }],
  //     });
  //   };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Qué es una comisión por descubierto?
      </Text>
      <Text style={styles.formText}>
        El Banco de España las define como “comisión que te cobra la entidad por
        admitir cargos en tu cuenta bancaria si no tienes saldo suficiente”.
        Está limitada por la Ley 16/2011 a 2,5 veces el interés legal del dinero
        por lo que siempre deberán ser cuantías diferentes ya que se
        corresponderá al “dinero prestado en cada caso”.
      </Text>
      {/* <View style={styles.formNavigationButtonsContainer}>
        <PrimaryButton onPress={handleNextStep} title="Siguiente" />
        <SecondaryButton onPress={handleGoHome} title="Salir" />
      </View> */}
    </ScrollView>
  );
};

export default StepQueEs;
