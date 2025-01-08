import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { createStyles } from "../../constants/styles";

const StepComoLoSe = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  useEffect(() => {
    if (currentStep !== 2) {
      updateStep(2);
    }
  }, [currentStep, updateStep]);

  const handleNextStep = () => {
    navigation.navigate("StepTienesMovimientos");
  };

  const handlePreviousStep = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Cómo saber si me han aplicado una comisión ilegal?
      </Text>
      <Text style={[styles.formText, { fontWeight: "bold" }]}>
        ANTES DE EMPEZAR A RECLAMAR LAS COMISIONES, NECESITAMOS QUE TENGAS A MANO
        LOS MOVIMIENTOS DE TU CUENTA BANCARIA.
      </Text>
      <Text style={styles.formText}>
        Aquí te explicamos cómo identificar si una comisión por descubierto es
        ilegal. Para identificar si una comisión por descubierto es ilegal se
        deben tener en cuenta dos aspectos:{"\n"}{"\n"}
        <Text style={{ fontWeight: "bold" }}>1.</Text> Que se te haya notificado la posible apertura del descubierto antes
        de su apertura (no será válida ninguna comunicación automática como SMS,
        emails, notificaciones de la App o llamadas robóticas).{"\n"}
        {"\n"}
        <Text style={{ fontWeight: "bold" }}>2.</Text> Que siempre sea por una cuantía fija, por ejemplo 30€.
      </Text>
      <Text style={styles.formTitle}>
        ¿Cómo puedo reclamar una comisión ilegal?
      </Text>
      <Text style={styles.formText}>
        Revisa los movimientos en tu cuenta corriente o ahorro y te explicaremos cómo identificar las comisiones potencialmente ilegales
        y qué debes tener en cuenta según tu banco (importes aproximados 30€ en
        adelante).
      </Text>
      <View style={styles.formNavigationButtonsContainer}>
        <PrimaryButton onPress={handleNextStep} title="Siguiente" />
        <SecondaryButton title="Atrás" onPress={handlePreviousStep} />
      </View>
    </ScrollView>
  );
};

export default StepComoLoSe;
