import React from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean
  ) => void;
  goToStep: (stepId: string) => void;
};

const StepCuantasCuentas: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const handleNextSingle = () => {
    updateData(stepId, { cantidadCuentas: 1 }, false);
    goToStep("6b");
  };

  const handleNextMultiple = () => {
    goToStep("6a");
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Estas comisiones se aplicaron en una sola cuenta o en varias?
      </Text>
      <Text style={styles.formText}>
        Si ha sido en varias, una vez finalices la presente reclamación,
        continuaremos con la siguiente cuenta.
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
          onPress={handleNextSingle}
          title="Solo en una"
          btnStyle={{ flex: 1 }}
        />
        <PrimaryButton
          onPress={handleNextMultiple}
          title="En varias"
          btnStyle={{ flex: 1 }}
        />
      </View>
    </ScrollView>
  );
};

export default StepCuantasCuentas;
