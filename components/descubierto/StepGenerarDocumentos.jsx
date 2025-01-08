import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import ProgressBar from "../ProgressBar";
import { createStyles } from "../../constants/styles";

const StepGenerarDocumentos = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  useEffect(() => {
    if (currentStep !== 14) {
      updateStep(14);
    }
  }, [currentStep, updateStep]);

  const handleNext = () => {
    // navigation.navigate("StepBanco");
    // mostramos el coste del servicio
  };
  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };

  return (
      <ScrollView style={styles.formContainer}>
        <Text style={styles.formTitle}>¿Generamos el documento ahora?</Text>
        <View style={styles.formNavigationButtonsContainer}>
          <SecondaryButton title="Más adelante" onPress={handleGoHome} />
          <SecondaryButton title="Atrás" onPress={() => navigation.goBack()} />
          <PrimaryButton title="Sí" onPress={handleNext} />
        </View>
      </ScrollView>
  );
};

export default StepGenerarDocumentos;
