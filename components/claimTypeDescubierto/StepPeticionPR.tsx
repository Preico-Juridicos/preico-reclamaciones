import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData, getCurrentUserId, storage } from "@/firebase.config";
import {
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import { useRouter } from "expo-router";
import { generatePR } from "@api/pdfGenerationService";

import { enviarSolicitudDeFirma } from "@api/firmaFyServicePR";

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

const StepPeticionPR: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
  claimCode,
}) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const [cantidadCuentas, setCantidadCuentas] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("formData");
        if (data) {
          const formData = JSON.parse(data);
          setCantidadCuentas(formData.cantidadCuentas || 1);
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  const subirPdfDesdeUrl = async (pdfUrl: string, pdfName: string) => {
    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error(
          `Error al obtener el PDF: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const storageRef = ref(storage, `documents/${pdfName}`); // Nombre único
      const metadata = {
        contentType: "application/pdf",
      };
      const snapshot = await uploadBytes(storageRef, blob, metadata);
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${
        storageRef.bucket
      }/o/${encodeURIComponent(storageRef.fullPath)}?alt=media`;

    //   console.log("PDF subido exitosamente:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir el PDF desde la URL:", error);
    }
  };

  const eliminarArchivoDelStorage = async (pdfName: string) => {
    const storageRef = ref(storage, `documents/${pdfName}`);
    await deleteObject(storageRef);
  };

  const handleSubmitPR = async () => {
    try {
      const userID = getCurrentUserId();
      if (!userID) return;
      const userD = await getUserData(userID);
      if (!userD) {
        throw new Error("No se ha podido obtener los datos del usuario");
      }
      if (!claimCode) return;
      //   console.log(claimCode);
      await updateData(claimCode, { hasPR: false }, true);

      //   console.log(data[claimCode]);
      const pdfData = {
        nombre: userD.name?.toUpperCase() + " " + userD.surnames?.toUpperCase(),
        dni: userD.dni,
        direccion: data[claimCode].address,
        cp: userD.postalCode,
      };
      //   Llamada sincrónica a la API para generar el PDF
      const pdfResponse = await generatePR({ claimCode, pdfData });
      if (!pdfResponse.success) {
        throw new Error("No se ha podido generar el PDF");
      }
      //   console.log(pdfResponse.fileName);
      //   console.log(data);

      // Guardamos el PDF en el storage de Firebase
      const newURL = await subirPdfDesdeUrl(
        pdfResponse.fileUrl,
        pdfResponse.fileName
      );
      //   console.log(newURL);
      //   Enviar el PDF a Firmafy
      const userData = {
        nombre: userD.name + " " + userD.surnames,
        dni: userD.dni,
        email: userD.email,
        cargo: "Contratante",
        telefono: 697222324,
      };
      const firmafyResponse = await enviarSolicitudDeFirma(
        pdfResponse.fileName,
        newURL,
        userData
      );

      console.log(firmafyResponse);
      if (!firmafyResponse.success) {
        throw new Error("Error al enviar a Firmafy");
      }

      await eliminarArchivoDelStorage(pdfResponse.fileName);

      Alert.alert(
        "Petición Enviada",
        cantidadCuentas === 1
          ? "Hemos enviando la petición a tu correo. Por favor vuelve cuando la tengas firmada."
          : "Hemos enviando la petición a tu correo. Por favor vuelve cuando la tengas firmada. Ahora procederemos con la siguiente cuenta."
      );
      // Esperar 2 segundos para que el usuario vea la alerta
      //   await new Promise((resolve) => setTimeout(resolve, 2000));

      if (cantidadCuentas > 1) {
        delete data[claimCode];
        await AsyncStorage.setItem("formData", JSON.stringify(data));
        const newCantidadCuentas = cantidadCuentas - 1;
        setCantidadCuentas(newCantidadCuentas);
        await updateCantidadCuentasInStorage(newCantidadCuentas);
        goToStep("6b");
      } else {
        await AsyncStorage.removeItem("formData");
        handleGoHome();
      }
    } catch (error) {
      console.error("Error al enviar la petición:", error);
      Alert.alert("Error", "Hubo un problema al enviar la petición.");
    }
  };

  const updateCantidadCuentasInStorage = async (newCantidadCuentas: number) => {
    try {
      const data = await AsyncStorage.getItem("formData");
      if (data) {
        const formData = JSON.parse(data);
        const updatedData = {
          ...formData,
          cantidadCuentas: newCantidadCuentas,
        };
        await AsyncStorage.setItem("formData", JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error("Error updating AsyncStorage:", error);
    }
  };

  const handleGoHome = () => {
    // Hacer que guarde el hasRP en false y el step en 16
    goToStep("-1");
    // router.push("/");
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>Petición poder representativo</Text>
      <Text style={styles.formText}>
        Necesitamos tu autorización para poder enviar la petición. Usamos un
        sistema seguro de firmas online para ello.
      </Text>
      <View style={{ gap: 10, marginTop: 10 }}>
        <PrimaryButton onPress={handleSubmitPR} title="Enviame la petición" />
        <SecondaryButton title="Mejor Luego" onPress={handleGoHome} />
      </View>
    </ScrollView>
  );
};

export default StepPeticionPR;
