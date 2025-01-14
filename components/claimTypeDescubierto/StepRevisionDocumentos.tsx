import React, { useEffect } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (stepId: string, data: Record<string, any>) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
};

const StepRevisionDocumentos: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  //   Revisar si tenemos el poder notarial,
  //   si los tenemos generamos los documentos y los enviamos
  //   si no los tenemos usamos firmafy
  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("formData");
      if (data !== null) {
        const formData = JSON.parse(data);

        console.log("Datos almacenados en AsyncStorage:", formData);

        const { hasPR } = formData[Object.keys(formData)[1]];

        console.log(hasPR);
        if (hasPR) {
          navigation.navigate("StepGenerarDocumentos");
        } else {
          navigation.navigate("StepPeticionPR");
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
  }, [navigation]);

  useEffect(() => {
    if (currentStep !== 13) {
      updateStep(13);
    }
  }, [currentStep, updateStep]);

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
