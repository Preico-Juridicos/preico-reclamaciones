import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import * as ImagePicker from "expo-image-picker";
import { scanDocument } from "@api/dniApiService";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore, getCurrentUserId } from "@/firebase.config";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

const StepUploadDNI = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();
  const [dniFront, setDniFront] = useState(null);
  const [dniBack, setDniBack] = useState(null);
  const [isFrontCaptured, setIsFrontCaptured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const checkDniExists = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          Alert.alert("Usuario no autenticado. Por favor, inicia sesión.");
          return;
        }
        const docRef = doc(firestore, "usuarios", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().dni) {
          navigation.navigate("StepDNI");
        }
      } catch (error) {
        console.error("Error al verificar el DNI en Firestore: ", error);
      }
    };

    checkDniExists();
  }, []);

  useEffect(() => {
    if (currentStep !== 11) {
      updateStep(11);
    }
  }, [currentStep, updateStep]);

  const pickImageWeb = async (setImage) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setImage(fileReader.result);
          checkImageOrientation(file);
        };
        fileReader.readAsDataURL(file);
        fileReader.onerror = () => {
          console.error("Error al leer el archivo");
        };
      }
    };
    input.click();
  };

  const takePictureMobile = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Se requieren permisos de cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const image = result.assets[0];
      if (!isFrontCaptured) {
        setDniFront(imageUri);
        checkImageOrientation(image);
        setIsFrontCaptured(true);
      } else {
        setDniBack(imageUri);
        checkImageOrientation(image);
      }
    }
  };

  const checkImageOrientation = (image) => {
    if (image.width > image.height) {
      Alert.alert("Imagen horizontal detectada", "Se rotará automáticamente.");
      // Aquí podrías aplicar un método para rotar la imagen si es necesario.
    }
  };

  const handleRedoFront = () => {
    setDniFront(null);
    setIsFrontCaptured(false);
  };

  const handleRedoBack = () => {
    setDniBack(null);
  };

  const handleUpload = async () => {
    if (!dniFront || !dniBack) {
      //   Alert.alert("Sube las dos imágenes primero.");
      return;
    }
    setIsUploading(true);
    try {
      const scanDataFront = await scanDocument(dniFront);
      const scanDataBack = await scanDocument(dniBack);
      let data = {
        dni: scanDataFront.idNumber,
        name: scanDataBack.name,
        surnames: scanDataBack.surnames,
        nationality: scanDataBack.nationality,
        gender: scanDataBack.gender,
        bornDate: scanDataFront.bornDate,
        expireDate: scanDataFront.expireDate,
        address: scanDataBack.address,
      };

      setDniFront(null);
      setDniBack(null);
      setIsFrontCaptured(false);
      const savedData = await saveToFirestore(data);
      if (savedData) {
        Alert.alert("Datos registrados correctamente.");
        navigation.navigate("StepDNI");
      } else {
        Alert.alert(
          "Error el documento de identificacion",
          "Ha pasado algo al procesar los datos de las imágenes intentalo de nuevo."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error el documento de identificacion",
        "Ha pasado algo al procesar los datos de las imágenes intentalo de nuevo."
      );
      console.log(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const saveToFirestore = async (data) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        Alert.alert("Usuario no autenticado. Por favor, inicia sesión.");
        return;
      }
      const docRef = doc(firestore, "usuarios", userId);
      await setDoc(docRef, data, { merge: true });
      return true;
    } catch (error) {
      return false;
      //   console.warn("Error al guardar en Firestore: ", error);
      //   throw error;
    }
  };

  if (isUploading) {
    return (
      <ScrollView
        contentContainerStyle={[styles.formContainer, pageStyles.container]}
      >
        <Text style={styles.formText}>Revisando los datos...</Text>
        <ActivityIndicator size="large" color="#e2d3b6" />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Necesitamos que escanees tu DNI para confirmar los datos personales
        según la normativa.
      </Text>
      <Text style={styles.formText}>
        Tus datos se manejan de acuerdo con la ley de protección de datos
      </Text>
      {Platform.OS === "web" ? (
        <>
          {dniFront && (
            <View>
              <Image
                source={{ uri: dniFront }}
                style={{
                  width: 200,
                  height: 200,
                  margin: 5,
                  borderRadius: 5,
                }}
              />
              <SecondaryButton
                title="Rehacer foto frontal"
                onPress={handleRedoFront}
              />
            </View>
          )}
          {dniBack && (
            <View>
              <Image
                source={{ uri: dniBack }}
                style={{
                  width: 200,
                  height: 200,
                  margin: 5,
                  borderRadius: 5,
                }}
              />
              <SecondaryButton
                title="Rehacer foto trasera"
                onPress={handleRedoBack}
              />
            </View>
          )}
          {!dniFront || !dniBack ? (
            <PrimaryButton
              title={
                !isFrontCaptured ? "Subir foto frontal" : "Subir foto trasera"
              }
              onPress={() =>
                pickImageWeb(!isFrontCaptured ? setDniFront : setDniBack)
              }
            />
          ) : null}
        </>
      ) : (
        <View style={styles.formNavigationButtonsContainer}>
          <View style={{ gap: 10, alignItems: "center" }}>
            {dniFront && (
              <View>
                <Image
                  source={{ uri: dniFront }}
                  style={{
                    width: 250,
                    height: 150,
                    margin: 5,
                    borderRadius: 5,
                  }}
                />
                <SecondaryButton
                  title="Rehacer foto frontal"
                  onPress={handleRedoFront}
                />
              </View>
            )}
            {dniBack && (
              <View>
                <Image
                  source={{ uri: dniBack }}
                  style={{
                    width: 250,
                    height: 150,
                    margin: 5,
                    borderRadius: 5,
                  }}
                />
                <SecondaryButton
                  title="Rehacer foto trasera"
                  onPress={handleRedoBack}
                />
              </View>
            )}
          </View>
          {!dniFront || !dniBack ? (
            <PrimaryButton
              title={
                !isFrontCaptured ? "Tomar foto frontal" : "Tomar foto trasera"
              }
              onPress={takePictureMobile}
              btnStyle={{ minWidth: 200 }}
            />
          ) : null}
        </View>
      )}
      <View style={styles.formNavigationButtonsContainer}>
        <PrimaryButton
          title="Subir y procesar fotos"
          onPress={handleUpload}
          btnStyle={{ minWidth: 200 }}
          disabled={!dniFront || !dniBack || isUploading}
        />
        <SecondaryButton
          onPress={() => {
            navigation.navigate("StepComisiones");
          }}
          title="Atràs"
        />
        {/* <PrimaryButton onPress={handleSubmit} title="Siguiente" /> */}
        {/* <SecondaryButton title="Atrás" onPress={() => navigation.goBack()} /> */}
      </View>
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

export default StepUploadDNI;
