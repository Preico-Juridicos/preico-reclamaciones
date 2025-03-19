import React, { useEffect } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  claimIdentifier?: string;
  updateData: (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean
  ) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
  claimCode: string | undefined;
};

const StepRevisionDocumentos: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  //   Revisar si tenemos el poder de respresentación,
  //   si los tenemos generamos los documentos y los enviamos
  //   si no los tenemos usamos firmafy
  const fetchData = async () => {
    try {
      //   console.log(data);

      if (!claimCode) {
        claimCode = Object.keys(data)[1];
        // console.log(Object.keys(data));
        // console.log(claimCode);
      }
      if (data !== undefined) {
        const { hasPR } = data[claimCode];
        console.log(hasPR);
        if (hasPR) {
          updateData(stepId, { hasPR: true }, true);
          goToStep("15");
        } else {
          updateData(stepId, { hasPR: false }, true);
          goToStep("16");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 2000);
    return () => clearTimeout(timer);
  }, [stepId]);

  return (
    <ScrollView
      contentContainerStyle={[styles.formContainer, pageStyles.container]}
    >
      <Text style={styles.formTitle}>Revisando la documentación</Text>
      <Text style={styles.formText}>Espera un momento por favor</Text>
    </ScrollView>
  );
};

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StepRevisionDocumentos;
