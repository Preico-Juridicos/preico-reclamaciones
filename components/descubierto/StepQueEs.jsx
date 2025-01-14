import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

const StepQueEs = ({ navigation, currentStep, updateStep }) => {
    const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  useEffect(() => {
    if (currentStep !== 1) {
      updateStep(1);
    }
  }, [currentStep]);

  const handleNextStep = () => {
    // updateStep(2);
    navigation.navigate("StepComoLoSe");
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };

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
      <View style={styles.formNavigationButtonsContainer}>
        <PrimaryButton onPress={handleNextStep} title="Siguiente" />
        <SecondaryButton onPress={handleGoHome} title="Salir" />
      </View>
    </ScrollView>
  );
};

export default StepQueEs;
