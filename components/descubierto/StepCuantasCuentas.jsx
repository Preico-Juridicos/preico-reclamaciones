import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStyles } from "../../constants/styles";

const StepCuantasCuentas = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  useEffect(() => {
    if (currentStep !== 6) {
      updateStep(6);
    }
  }, [currentStep, updateStep]);

  const handleNext1 = () => {
    navigation.navigate("StepCuantasCuentas1");
  };
  const handleSubmit = async () => {
    try {
      const existingData = await AsyncStorage.getItem("formData");
      const formData = existingData ? JSON.parse(existingData) : {};

      const updatedData = { ...formData, cantidadCuentas: 1 };
      await AsyncStorage.setItem("formData", JSON.stringify(updatedData));

      navigation.navigate("StepBanco");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Estas comisiones se aplicaron en una sola cuenta o en varias?
      </Text>
      <Text style={styles.formText}>
        Si ha sido en varias, una vez finalices la presente reclamación,
        continuaremos con la siguiete cuenta.
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <PrimaryButton
          onPress={handleSubmit}
          title="Solo en una"
          btnStyle={{ flex: 1 }}
        />
        <PrimaryButton
          onPress={handleNext1}
          title="En varias"
          btnStyle={{ flex: 1 }}
        />
      </View>

      <View style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <SecondaryButton title="Atrás" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

export default StepCuantasCuentas;
