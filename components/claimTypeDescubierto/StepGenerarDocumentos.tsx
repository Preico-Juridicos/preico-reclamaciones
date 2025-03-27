import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import ProgressBar from "../ProgressBar";
// import { createStyles } from "../../constants/styles";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

import {
  getUserData,
  getCurrentUserId,
  storage,
  firestore,
} from "@/firebase.config";
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { generateComisionDescubierto } from "@/api/pdfGenerationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";

interface Comision {
  fecha: string;
  importe: string;
}

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

const StepGenerarDocumentos: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const [entidadBancariaId, setEntidadBancariaId] = useState("");
  const [entidadBancaria, setEntidadBancaria] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");

  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [totalComisiones, setTotalComisiones] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!data || !claimCode) return;

        const { entidadBancaria, numeroCuenta, comisiones } = data[claimCode];

        // 🛠️ Formatear fechas
        const comisionesFormateadas = comisiones.map((comision: { fecha: string | number | Date; }) => ({
          ...comision,
          fecha: new Date(comision.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        }));

        setEntidadBancariaId(entidadBancaria);
        setNumeroCuenta(numeroCuenta);
        setComisiones(comisionesFormateadas);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const total = comisiones.reduce(
      (suma, item) => suma + parseFloat(item.importe),
      0
    );
    setTotalComisiones(parseFloat(total.toFixed(2)));
    console.log("Número de cuenta:", numeroCuenta);
    console.log("Comisiones:", comisiones);
    console.log("Total comisiones:", total.toFixed(2));
  }, [comisiones]);

  useEffect(() => {
    const fetchBankLabel = async () => {
      try {
        if (!entidadBancariaId) return;

        const querySnapshot = await getDocs(collection(firestore, "bancos"));
        const banksData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            label: data.banco_nombre_comercial || data.banco_nombre,
            value: doc.id,
          };
        });

        const banco = banksData.find(
          (bank) => bank.value === entidadBancariaId
        );
        if (banco) {
          setEntidadBancaria(banco.label);
        }

        console.log("Entidad bancaria:", banco?.label);
      } catch (error) {
        console.error("Error fetching bancos:", error);
      }
    };

    fetchBankLabel();
  }, [entidadBancariaId]);

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

      return downloadURL;
    } catch (error) {
      console.error("Error al subir el PDF desde la URL:", error);
    }
  };

  const eliminarArchivoDelStorage = async (pdfName: string) => {
    const storageRef = ref(storage, `documents/${pdfName}`);
    await deleteObject(storageRef);
  };

  const handleGenerateDocument = async () => {
    try {
      const userID = getCurrentUserId();
      if (!userID) return;
      const userD = await getUserData(userID);
      if (!userD) {
        throw new Error("No se ha podido obtener los datos del usuario");
      }
      if (!claimCode) return;

      const pdfData = {
        entidadBancaria: entidadBancaria,
        nombre: userD.name?.toUpperCase() + " " + userD.surnames?.toUpperCase(),
        dni: userD.dni,
        direccion: data[claimCode].address,
        cp: userD.postalCode,
        numeroCuenta: numeroCuenta,
        fechaHoy: new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        comisiones: comisiones,
        totalComisiones: totalComisiones,
      };

      //   Llamada sincrónica a la API para generar el PDF
      const pdfResponse = await generateComisionDescubierto({
        claimCode,
        pdfData,
      });
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
      console.log(newURL);
      //   Enviar el PDF a Firmafy
      //   const userData = {
      //     nombre: userD.name + " " + userD.surnames,
      //     dni: userD.dni,
      //     email: userD.email,
      //     cargo: "Contratante",
      //     telefono: 697222324,
      //   };
      //   const firmafyResponse = await enviarSolicitudDeFirma(
      //     pdfResponse.fileName,
      //     newURL,
      //     userData
      //   );

      //   console.log(firmafyResponse);
      //   if (!firmafyResponse.success) {
      //     throw new Error("Error al enviar a Firmafy");
      //   }

      //   await eliminarArchivoDelStorage(pdfResponse.fileName);
    } catch (error) {
      console.error("Error al enviar la petición:", error);
    }
  };

  const handleGoHome = () => {
    goToStep("-1");
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>¿Generamos el documento ahora?</Text>
      <View style={styles.formNavigationButtonsContainer}>
        <PrimaryButton title="Sí" onPress={handleGenerateDocument} />
        <SecondaryButton title="Más adelante" onPress={handleGoHome} />
      </View>
    </ScrollView>
  );
};

export default StepGenerarDocumentos;
