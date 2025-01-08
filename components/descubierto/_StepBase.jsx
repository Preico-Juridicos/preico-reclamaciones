import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { createStyles } from "../../constants/styles";

const _StepBase = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  useEffect(() => {
    if (currentStep !== 0) {
      updateStep(0);
    }
  }, [currentStep, updateStep]);

  const handleNext = () => {
    navigation.navigate("StepBanco");
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>Titulo</Text>
      <Text style={styles.formText}>Texto</Text>
      <View style={styles.formNavigationButtonsContainer}>
        <PrimaryButton onPress={handleNext} title="Siguiente" />
        <SecondaryButton title="Atrás" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2e8cf" },
  content: { flexGrow: 1, padding: 10, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  description: { fontSize: 16, marginBottom: 20, textAlign: "center" },
});

export default _StepBase;
