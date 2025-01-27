import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";

import { handleBankStepEvent } from "@/components/claimTypeDescubierto/descubiertoLogic";

// Componente de Descubierto
import StepQueEs from "@/components/claimTypeDescubierto/StepQueEs";
import StepComoLoSe from "@/components/claimTypeDescubierto/StepComoLoSe";
import StepTienesMovimientos from "@/components/claimTypeDescubierto/StepTienesMovimientos";
import StepSolicitarMovimientos from "@/components/claimTypeDescubierto/StepSolicitarMovimientos";
import StepReclamacionAhora from "@/components/claimTypeDescubierto/StepReclamacionAhora";
import StepCuantasCuentas from "@/components/claimTypeDescubierto/StepCuantasCuentas";
import StepCuantasCuentas1 from "@/components/claimTypeDescubierto/StepCuantasCuentas1";
import StepBanco from "@/components/claimTypeDescubierto/StepBanco";
import StepNumeroCuenta from "@/components/claimTypeDescubierto/StepNumeroCuenta";
import StepComisiones from "@/components/claimTypeDescubierto/StepComisiones";
import StepQuienEnvia from "@/components/claimTypeDescubierto/StepQuienEnvia";
import StepUploadDNI from "@/components/claimTypeDescubierto/StepUploadDNI";
import StepDNI from "@/components/claimTypeDescubierto/StepDNI";
import StepConfirmarDireccion from "@/components/claimTypeDescubierto/StepConfirmarDireccion";
import StepRevisionDocumentos from "@/components/claimTypeDescubierto/StepRevisionDocumentos";
import StepPeticionPR from "@/components/claimTypeDescubierto/StepPeticionPR";
import StepGenerarDocumentos from "@/components/claimTypeDescubierto/StepGenerarDocumentos";
import Summary from "@/components/claimTypeDescubierto/Summary";
import { getCurrentUserId } from "@/firebase.config";

// Tipos
type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  claimIdentifier?: string;
  updateData: (stepId: string, data: Record<string, any>) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
};

type Step = {
  id: string;
  component: React.ComponentType<StepComponentProps>;
  isBranching?: boolean;
  onNext?: (data: Record<string, any>) => void;
};

type ClaimSteps = {
  [key: string]: Step[];
};

// Componente principal
const ClaimForm: React.FC = () => {
  const router = useRouter();
  const { claimId } = useLocalSearchParams<{ claimId: string }>();

  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Record<string, Record<string, any>>>(
    {}
  );
  const [currentStepId, setCurrentStepId] = useState<string>("1");
  const [canContinue, setCanContinue] = useState<boolean>(true);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [claimIdentifier, setClaimIdentifier] = useState<string | null>(null);
  const [claimTitle, setClaimTitle] = useState<string | null>(null);

  // Mapa de pasos por tipo de claim
  const claimSteps: ClaimSteps = {
    descubierto: [
      { id: "1", component: StepQueEs },
      { id: "2", component: StepComoLoSe },
      { id: "3", component: StepTienesMovimientos, isBranching: true },
      { id: "4a", component: StepReclamacionAhora, isBranching: true },
      { id: "4b", component: StepSolicitarMovimientos, isBranching: true },
      { id: "5", component: StepCuantasCuentas, isBranching: true },
      { id: "6a", component: StepCuantasCuentas1 },
      { id: "6b", component: StepBanco, onNext: handleBankStepEvent },
      { id: "8", component: StepNumeroCuenta },
      { id: "9", component: StepComisiones },
      { id: "10", component: StepQuienEnvia, isBranching: true },
      { id: "11", component: StepUploadDNI },
      { id: "12", component: StepDNI },
      { id: "14", component: StepConfirmarDireccion },
      { id: "15", component: StepRevisionDocumentos },
      { id: "16", component: StepPeticionPR },
      { id: "17", component: StepGenerarDocumentos },
      { id: "18", component: Summary },
    ],
  };

  // Identifica los pasos del claim actual
  const steps = claimSteps[claimId || "descubierto"] || [];
  const currentStep = steps.find((step) => step.id === currentStepId);

  if (!currentStep) {
    return <Text>Error: Paso no encontrado</Text>;
  }

  // Actualizar los datos del paso actual en el estado y AsyncStorage
  const updateData = async (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean = false
  ) => {
    try {
      if (!isInFireBase) {
        setFormData((prevData) => {
          const updatedData = { ...prevData, [stepId]: data };
          AsyncStorage.setItem("formData", JSON.stringify(updatedData));
          return updatedData;
        });
      } else {
        // Obtén los datos actuales de AsyncStorage
        const currentData = await AsyncStorage.getItem("formData");
        if (currentData) {
          const parsedData = JSON.parse(currentData);

          // Asegúrate de que claimIdentifier esté definido y sea válido
          if (claimIdentifier) {
            const updatedClaimData = {
              ...parsedData[claimIdentifier],
              ...data, // Actualiza con los nuevos datos
            };

            // Asigna los datos actualizados al identificador del claim
            parsedData[claimIdentifier] = updatedClaimData;

            // Guarda los datos actualizados en AsyncStorage
            await AsyncStorage.setItem("formData", JSON.stringify(parsedData));
          } else {
            console.error("claimIdentifier no está definido.");
          }
        } else {
          console.error("No se encontró ningún dato en AsyncStorage.");
        }
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  // Recuperar los datos guardados al cargar el componente
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("formData");
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error al cargar los datos guardados:", error);
      }
    };

    switch (claimId) {
      case "descubierto":
        setClaimTitle("Reclamación por decubierto");
        break;
      default:
        setClaimTitle("Reclamación no registrada");
        break;
    }

    loadFormData();
  }, []);

  // Ir a un paso específico (para ramificaciones)
  const goToStep = (stepId: string) => {
    setNavigationHistory((prev) => [...prev, currentStepId]);
    setCurrentStepId(stepId);
    setCanContinue(false);
  };

  // Ir al paso siguiente basado en el índice actual
  const handleNextStep = async () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);

    if (currentStep.onNext) {
      const result = await currentStep.onNext(formData[currentStepId] || {});
      if (result !== undefined) {
        setClaimIdentifier(result); // Guardar el identificador en el estado
      }
    }

    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      setNavigationHistory((prev) => [...prev, currentStepId]);
      setCurrentStepId(nextStepId);
      setCanContinue(false);
    } else {
      console.log("Formulario completado:", formData);
      router.push("/success");
    }
  };

  // Retroceder al paso anterior basado en el historial
  const handlePrevStep = () => {
    if (navigationHistory.length > 0) {
      const previousStepId = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      setCurrentStepId(previousStepId);
      setCanContinue(true);
    }
  };

  const CurrentStepComponent = currentStep.component;

  // Volver al inicio
  const handleGoToHome = () => {
    router.push("/");
  };

  const cleanStoredData = async () => {
    try {
      await AsyncStorage.removeItem("formData");
      setFormData({});
      console.log("formData eliminado de AsyncStorage");
    } catch (error) {
      console.error("Error al eliminar formData de AsyncStorage:", error);
    }
  };

  const logStoredData = async () => {
    try {
      const data = await AsyncStorage.getItem("formData");
      if (data !== null) {
        console.log("Contenido de formData:", JSON.parse(data));
      } else {
        console.log("No se encontró ningún dato en formData");
      }
      //   console.log(getCurrentUserId());
    } catch (error) {
      console.error("Error al obtener formData de AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.claimContainer}>
      <Text style={[styles.screenTitle, { marginTop: 15, marginRight: 20 }]}>
        {claimTitle}
      </Text>
      <View style={styles.claimStepContainer}>
        <CurrentStepComponent
          stepId={currentStepId}
          data={formData[currentStepId] || {}}
          updateData={updateData}
          goToStep={goToStep}
          setCanContinue={setCanContinue}
        />
      </View>

      {/* Botones de navegación */}
      <View style={styles.claimButtonContainer}>
        {steps.findIndex((step) => step.id === currentStepId) > 0 && (
          <SecondaryButton title="Anterior" onPress={handlePrevStep} />
        )}
        <PrimaryButton title="consola" onPress={logStoredData} />
        <SecondaryButton title="clean formData" onPress={cleanStoredData} />
        {!currentStep.isBranching && (
          <PrimaryButton
            title={
              steps.findIndex((step) => step.id === currentStepId) <
              steps.length - 1
                ? "Siguiente"
                : "Finalizar"
            }
            onPress={handleNextStep}
            disabled={!canContinue}
          />
        )}
      </View>
    </View>
  );
};

export default ClaimForm;
