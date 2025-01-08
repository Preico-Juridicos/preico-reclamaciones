import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { createStyles } from "../../constants/styles";

const StepTienesMovimientos = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  useEffect(() => {
    if (currentStep !== 3) {
      updateStep(3);
    }
  }, [currentStep]);

  const handleNextStep = () => {
    // updateStep(4);
    navigation.navigate("StepReclamacionAhora");
  };
  const handleNextStep2 = () => {
    // updateStep(4);
    navigation.navigate("StepSolicitarMovimientos");
  };
  
  const handlePreviousStep = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Tienes los movimientos de tu cuenta bancaria?
      </Text>
      <View style={{ gap: 10 }}>
        <PrimaryButton onPress={handleNextStep} title="Sí" />
        <SecondaryButton
          onPress={handleNextStep2}
          title="No"
        />
        
        <SecondaryButton title="Atrás" onPress={handlePreviousStep} />
      </View>
    </ScrollView>
  );
};

export default StepTienesMovimientos;
