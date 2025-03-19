import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useFocusEffect } from "@react-navigation/native";

import {
  handleBankStepEvent,
  handleComisionesStepEvent,
  handleNumeroCuentaStepEvent,
  handleDNIStepEvent,
  handleConfirmarDireccionStepEvent,
  handleQuienEnviaStepEvent,
  handlePeticionPRStepEvent,
} from "@/components/claimTypeDescubierto/descubiertoLogic";

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
import { getCurrentUserId, firestore } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";

const loadClaimDataFromFirebase = async (claimCode: string) => {
  try {
    const userId = getCurrentUserId();

    const claimRef = doc(
      firestore,
      `usuarios/${userId}/reclamaciones/${claimCode}`
    );
    const claimSnap = await getDoc(claimRef);

    if (claimSnap.exists()) {
      return { [claimCode]: claimSnap.data() };
    } else {
      console.log("No se encontraron datos para este claimCode.");
      return null;
    }
  } catch (error) {
    console.error("Error al cargar datos desde Firebase:", error);
    return null;
  }
};

// Tipos
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

type Step = {
  id: string;
  component: React.ComponentType<StepComponentProps>;
  isBranching?: boolean;
  onNext?: (data: Record<string, any>, claimId: string | null) => void;
};

type ClaimSteps = {
  [key: string]: Step[];
};

// Componente principal
const ClaimForm: React.FC = () => {
  const router = useRouter();
  const { claimId, claimCode, claimStep } = useLocalSearchParams<{
    claimId: string;
    claimCode: string;
    claimStep: string;
  }>();

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
  const [claimCustomCode, setClaimCode] = useState<string | undefined>(
    undefined
  );
  const [claimTitle, setClaimTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      {
        id: "6b",
        component: StepBanco,
        onNext: handleBankStepEvent,
      },
      {
        id: "8",
        component: StepNumeroCuenta,
        onNext: handleNumeroCuentaStepEvent,
      },
      { id: "9", component: StepComisiones, onNext: handleComisionesStepEvent },
      {
        id: "10",
        component: StepQuienEnvia,
        isBranching: false,
        onNext: handleQuienEnviaStepEvent,
      },
      { id: "11", component: StepUploadDNI },
      { id: "12", component: StepDNI, onNext: handleDNIStepEvent },
      {
        id: "14",
        component: StepConfirmarDireccion,
        onNext: handleConfirmarDireccionStepEvent,
      },
      { id: "15", component: StepRevisionDocumentos },
      {
        id: "16",
        component: StepPeticionPR,
        onNext: handlePeticionPRStepEvent,
      },
      { id: "17", component: StepGenerarDocumentos },
      { id: "18", component: Summary },
    ],
  };

  useEffect(() => {
    // console.log("Estado actualizado: canContinue ->", canContinue);
    setCanContinue((prev) => (!prev ? false : true)); // Forzar actualización en React
  }, [canContinue]);

  // Identifica los pasos del claim actual
  const steps = claimSteps[claimId || "descubierto"] || [];
  const currentStep = steps.find((step) => step.id === currentStepId);

  // Recuperar los datos guardados al cargar el componente
  useEffect(() => {
    const initializeClaim = async () => {
      if (claimCode && claimStep) {
        const claimData = await loadClaimDataFromFirebase(claimCode);
        // console.log(claimData);
        if (claimData) {
          await AsyncStorage.setItem("formData", JSON.stringify(claimData));
          setFormData(claimData); // Carga los datos en el estado
          setClaimCode(claimCode); // Guarda el código del reclamo
          setCurrentStepId(claimStep); // Avanza al paso correspondiente
          setClaimIdentifier(Object.keys(claimData)[0]);
        } else {
          console.log("No se encontraron datos para continuar el reclamo.");
        }
      } else {
        // Si no hay claimCode o claimStep, cargar datos locales (AsyncStorage)
        const savedData = await AsyncStorage.getItem("formData");
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      }

      switch (claimId) {
        case "descubierto":
          setClaimTitle("Reclamación por descubierto");
          break;
        default:
          setClaimTitle("Reclamación no registrada");
          break;
      }
      setIsLoading(false); // Finaliza la carga
    };

    initializeClaim();
  }, [claimCode, claimStep]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Limpiar todos los estados
        setFormData({});
        setCurrentStepId("1");
        setCanContinue(false);
        setNavigationHistory([]);
        setClaimIdentifier(null);
        setClaimCode(undefined); // <-- Añadir esta línea
        setClaimTitle(null);

        // Limpiar AsyncStorage
        AsyncStorage.removeItem("formData");
        console.log("Datos limpiados al salir del componente.");
      };
    }, [])
  );

  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

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
      // Antes de revisar isInFireBase, mira si claimCode existe para actualizar los datos en AsyncStorage y no crear nuevos en Firebase
      // console.log("claimCode:", claimCode);
      // console.log("isInFireBase:", isInFireBase);
      // console.log("data:", data);
      if (!claimCode) {
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
              setFormData(parsedData);
              await AsyncStorage.setItem(
                "formData",
                JSON.stringify(parsedData)
              );
            } else {
              console.error("claimIdentifier no está definido.");
            }
          } else {
            console.error("No se encontró ningún dato en AsyncStorage.");
          }
        }
      } else {
        const currentData = await AsyncStorage.getItem("formData");
        if (currentData) {
          const parsedData = JSON.parse(currentData);
          const updatedClaimData = {
            ...parsedData[claimCode],
            ...data, // Actualiza con los nuevos datos
          };

          // Asigna los datos actualizados al identificador del claim
          parsedData[claimCode] = updatedClaimData;
          setFormData(parsedData);
          await AsyncStorage.setItem("formData", JSON.stringify(parsedData));
        }
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  // Ir a un paso específico (para ramificaciones)
  const goToStep = async (stepId: string) => {
    try {
      console.log("goToStep:", stepId);
      await handleOnNextEvents();
      if (stepId === "-1") {
        handleGoToHome();
        return;
      }
      setNavigationHistory((prev) => [...prev, currentStepId]);
      setCurrentStepId(stepId);
    } catch (error) {
      console.error("Error en handleOnNextEvents:", error);
    }
  };

  // Ir al paso siguiente basado en el índice actual
  const handleNextStep = async () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);

    handleOnNextEvents();

    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;

      setNavigationHistory((prev) => [...prev, currentStepId]);
      setCurrentStepId(nextStepId);
    } else {
      console.log("Formulario completado:", formData);
      router.push("/success");
    }
  };

  const handleOnNextEvents = async (): Promise<void> => {
    if (currentStep.onNext) {
      // Añadir lógica para los eventos personalizados de los pasos
      switch (true) {
        case currentStep.onNext.toString().includes("handleBankStepEvent"):
          if (claimIdentifier === null) {
            const result = await currentStep.onNext(
              formData || {},
              claimIdentifier
            );
            if (result !== undefined) {
              setClaimIdentifier(result); // Guardar el identificador en el estado
            }
          }
          break;
        case currentStep.onNext
          .toString()
          .includes("handleNumeroCuentaStepEvent"):
        case currentStep.onNext
          .toString()
          .includes("handleComisionesStepEvent"):
        case currentStep.onNext.toString().includes("handleDNIStepEvent"):
        case currentStep.onNext
          .toString()
          .includes("handleQuienEnviaStepEvent"):
        case currentStep.onNext
          .toString()
          .includes("handleConfirmarDireccionStepEvent"):
        case currentStep.onNext
          .toString()
          .includes("handlePeticionPRStepEvent"):
          await currentStep.onNext(formData || {}, claimIdentifier);
          break;
        default:
          break;
      }
    }
  };

  // Retroceder al paso anterior basado en el historial
  const handlePrevStep = () => {
    if (navigationHistory.length > 0) {
      const previousStepId = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      setCurrentStepId(previousStepId);
      setCanContinue(false);
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
      console.log(canContinue);
      const data = await AsyncStorage.getItem("formData");
      if (data !== null) {
        console.log("Contenido de formData:", JSON.parse(data));
      } else {
        console.log("No se encontró ningún dato en formData");
      }
    } catch (error) {
      console.error("Error al obtener formData de AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.claimContainer} key={`${claimCode}-${claimStep}`}>
      <Text style={[styles.screenTitle, { marginTop: 15, marginRight: 20 }]}>
        {claimTitle}
      </Text>
      <View style={styles.claimStepContainer}>
        <CurrentStepComponent
          stepId={currentStepId}
          data={formData}
          updateData={updateData}
          goToStep={goToStep}
          setCanContinue={setCanContinue}
          claimCode={claimCustomCode} // Pasar el código del reclamo
        />
      </View>

      {/* Botones de navegación */}
      <View style={styles.claimButtonContainer}>
        {steps.findIndex((step) => step.id === currentStepId) > 0 && (
          <SecondaryButton title="Anterior" onPress={handlePrevStep} />
        )}
        <PrimaryButton title="consola" onPress={logStoredData} />
        {/* <SecondaryButton title="clean formData" onPress={cleanStoredData} /> */}
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
