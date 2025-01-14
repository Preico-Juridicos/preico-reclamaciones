import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (stepId: string, data: Record<string, any>) => void;
  goToStep: (stepId: string) => void;
};

const StepTienesMovimientos: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const handleSelectOptionA = () => {
    // updateData(stepId, { ...data, selectedOption: "A" });
    goToStep("4a"); // Ir al camino A
  };

  const handleSelectOptionB = () => {
    // updateData(stepId, { ...data, selectedOption: "B" });
    goToStep("4b"); // Ir al camino B
  };

  //   useEffect(() => {
  //     if (currentStep !== 3) {
  //       updateStep(3);
  //     }
  //   }, [currentStep]);

  //   const handleNextStep = () => {
  //     // updateStep(4);
  //     navigation.navigate("StepReclamacionAhora");
  //   };
  //   const handleNextStep2 = () => {
  //     // updateStep(4);
  //     navigation.navigate("StepSolicitarMovimientos");
  //   };

  //   const handlePreviousStep = () => {
  //     navigation.goBack();
  //   };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Tienes los movimientos de tu cuenta bancaria?
      </Text>
      <View style={{ gap: 10 }}>
        <PrimaryButton onPress={handleSelectOptionA} title="Sí" />
        <SecondaryButton onPress={handleSelectOptionB} title="No" />
      </View>
    </ScrollView>
  );
};

export default StepTienesMovimientos;
