import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";
import QuantityInput from "@/components/QuantityInput";

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

const StepCuantasCuentas1: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [cantidadCuentas, setCantidadCuentas] = useState<number>(
    data.cantidadCuentas || 1
  );

  useEffect(() => {
    // Solo actualiza si el valor ha cambiado
    if (data.cantidadCuentas !== cantidadCuentas) {
      updateData(stepId, { cantidadCuentas }, false);
      setCanContinue(true);
    }
  }, [cantidadCuentas]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      Alert.alert(
        "Error",
        "El campo de cantidad de cuentas debe ser mayor a 0."
      );
      return;
    }
    setCantidadCuentas(value);
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Indícanos en cuántas cuentas se aplicaron las comisiones
      </Text>
      <Text style={styles.formText}>
        Una vez finalices la reclamación actual, repetiremos el proceso para
        cada una de las cuentas bancarias que tengas. Por ello, te pedimos que
        nos indiques en cuántas cuentas bancarias se han aplicado.
      </Text>
      <QuantityInput
        min={1}
        max={10}
        value={cantidadCuentas}
        onChangeText={(value: string) => handleQuantityChange(Number(value))}
        onIncrease={() => handleQuantityChange(cantidadCuentas + 1)}
        onDecrease={() => handleQuantityChange(cantidadCuentas - 1)}
      />
    </ScrollView>
  );
};

export default StepCuantasCuentas1;
