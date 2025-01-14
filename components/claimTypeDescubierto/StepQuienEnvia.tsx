import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

import ProgressBar from "../ProgressBar";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (stepId: string, data: Record<string, any>) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
};

const StepQuienEnvia: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

//   useEffect(() => {
//     if (currentStep !== 10) {
//       updateStep(10);
//     }
//   }, [currentStep, updateStep]);

const handleNext = () => {
    updateData(stepId, { ...data, selectedOption: "A" });
    goToStep("11");
};
//   const handleNext = () => {
//     navigation.navigate("StepUploadDNI");
//   };
//   const handleNext1 = () => {
//     // Añadir flag para guardar en firebase y redirigir
//     navigation.navigate("StepUploadDNI");
//   };
//   const handlePreviousStep = () => {
//     navigation.goBack();
//   };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>¿Quién enviará la reclamación?</Text>
      <View style={{ gap: 10 }}>
        <PrimaryButton onPress={handleNext} title="La enviaré yo mismo" />
        <SecondaryButton
          onPress={handleNext}
          title="Prefiero que lo gestione Preico Jurídicos"
        />
        {/* <SecondaryButton title="Atrás" onPress={handlePreviousStep} /> */}
      </View>
    </ScrollView>
  );
};

export default StepQuienEnvia;
