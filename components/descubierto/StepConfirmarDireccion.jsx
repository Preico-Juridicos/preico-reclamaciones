import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Añadir getFirestore
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { firestore, getCurrentUserId } from "../../constants/firebaseConfig";
import { createStyles } from "../../constants/styles";

const getUserInfo = async (docId) => {
  const db = getFirestore(); // Inicializa Firestore
  const usuarioRef = doc(db, "usuarios", docId);

  try {
    const docSnap = await getDoc(usuarioRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const address = data.address;
      return address;
    } else {
      console.log("No se encontró el documento");
    }
  } catch (error) {
    console.error("Error al recuperar los campos: ", error);
  }
};

const StepConfirmarDireccion = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  const [initialValues, setInitialValues] = useState({
    address: "",
  });

  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Este campo es obligatorio"),
  });

  useEffect(() => {
    if (currentStep !== 12) {
      updateStep(12);
    }
  }, [currentStep, updateStep]);

  useEffect(() => {
    const fetchExternalData = async () => {
      try {
        const userId = getCurrentUserId();

        if (userId) {
          const address = await getUserInfo(userId);
          const existingData = await AsyncStorage.getItem("formData");
          if (existingData !== null) {
            const formData = JSON.parse(existingData);
            setInitialValues({
              address: formData.address || address,
            });
          }
        } else {
          console.log("No hay usuario autenticado.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchExternalData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      // Obtener los datos existentes de AsyncStorage
      const existingData = await AsyncStorage.getItem("formData");
      const formData = existingData ? JSON.parse(existingData) : {};

      // Encuentra la clave dinámica (ejemplo: la clave que contiene "reclamacionId")
      const reclamacionIdKey = Object.keys(formData)[1];

      if (!reclamacionIdKey) {
        console.error(
          "No se encontró una clave dinámica 'reclamacionId' en formData"
        );
        return;
      }

      // Combinar el nuevo valor con el valor existente
      const currentData = formData[reclamacionIdKey] || [];
      const updatedValue = Array.isArray(currentData)
        ? [...currentData, values] // Si es un array, añade los valores al array
        : { ...currentData, ...values }; // Si es un objeto, fusiona los objetos

      // Actualiza el objeto formData con el valor combinado
      const updatedData = {
        ...formData,
        [reclamacionIdKey]: updatedValue,
      };

      // Guarda los datos actualizados en AsyncStorage
      await AsyncStorage.setItem("formData", JSON.stringify(updatedData));

      const userId = getCurrentUserId();

      const docRef = doc(
        firestore,
        `usuarios/${userId}/reclamaciones`,
        reclamacionIdKey
      );

      console.log(JSON.stringify(updatedData[reclamacionIdKey]));
      await setDoc(
        docRef,
        {
          currentStep: "StepConfirmarDireccion",
          ...updatedValue,
        },
        { merge: true }
      );

      // Realiza la navegación u otras acciones necesarias
        navigation.navigate("StepRevisionDocumentos");
    } catch (error) {
      console.error("Error al manejar el formulario:", error);
    }
  };

  const handlePreviousStep = () => {
    navigation.goBack();
  };
  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Tu dirección es "{initialValues.address}"?
      </Text>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <Text style={styles.formLabel}>
              Si tu dirección no es correcta aqui puedes cambiarla.
            </Text>
            <TextInput
              style={styles.formInput}
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              value={values.address}
              placeholder="Dirección"
            />
            {touched.address && errors.address && (
              <Text style={styles.formError}>{errors.address}</Text>
            )}

            <View style={styles.formNavigationButtonsContainer}>
              <PrimaryButton onPress={handleSubmit} title="Siguiente" />
              <SecondaryButton title="Atrás" onPress={handlePreviousStep} />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default StepConfirmarDireccion;
