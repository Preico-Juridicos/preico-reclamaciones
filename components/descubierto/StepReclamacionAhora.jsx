import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

const StepReclamacionAhora = ({ navigation, currentStep, updateStep }) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  useEffect(() => {
    if (currentStep !== 5) {
      updateStep(5);
    }
  }, [currentStep, updateStep]);

  const handleNextStep = () => {
    navigation.replace("StepCuantasCuentas");
  };

  const handlePreviousStep = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    // Aqui falta añadir un proceso que guarde en firebase el step actual
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Te preparamos el documento de reclamación ahora?
      </Text>
      <View style={{ gap: 10, marginTop: 10 }}>
        <PrimaryButton onPress={handleNextStep} title="Sí" />
        <SecondaryButton title="Más adelante" onPress={handleGoHome} />
        <SecondaryButton title="Atras" onPress={handlePreviousStep} />
      </View>
    </ScrollView>
  );
};

export default StepReclamacionAhora;
