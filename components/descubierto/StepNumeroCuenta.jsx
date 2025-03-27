import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

const StepNumeroCuenta = ({ navigation, currentStep, updateStep }) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const [initialValues, setInitialValues] = useState({ numeroCuenta: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("formData");
        if (data !== null) {
          const formData = JSON.parse(data);
          setInitialValues({
            numeroCuenta:
              formData.numeroCuenta || "ES23 2323 2323 2323 2323 2323",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentStep !== 9) {
      updateStep(9);
    }
  }, [currentStep, updateStep]);

  const validationSchema = Yup.object().shape({
    numeroCuenta: Yup.string()
      .matches(
        /^ES\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
        "Debe ser un número de cuenta válido (Formato: ESXX XXXX XXXX XXXX XXXX XXXX)"
      )
      .required("Este campo es obligatorio"),
  });

  const handleSubmit = async (values) => {
    try {
      const existingData = await AsyncStorage.getItem("formData");
      const formData = existingData ? JSON.parse(existingData) : {};

      const reclamacionIdKey = Object.keys(formData)[1];
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
      await AsyncStorage.setItem("formData", JSON.stringify(updatedData));

      navigation.navigate("StepComisiones");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Introduce el número de cuenta o cuentas
      </Text>
      <Text style={styles.formText}>
        Según la ORDEN ECO/734/2004, se requiere especificación del producto o
        productos bancarios y la identificación de la oficina. Es por ello por
        lo que necesitamos que nos detalles los números de tu cuenta para la
        reclamación. En ellos aparece el{" "}
        <Text style={{ textDecorationLine: "underline" }}>
          código de la entidad bancaria
        </Text>{" "}
        y la{" "}
        <Text style={{ textDecorationLine: "underline" }}>
          oficina que gestiona tu cuenta
        </Text>
        .
      </Text>
      <Formik
        initialValues={initialValues}
        enableReinitialize
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
          <>
            <TextInput
              style={[styles.formInput, { marginTop: 20 }]}
              onChangeText={handleChange("numeroCuenta")}
              onBlur={handleBlur("numeroCuenta")}
              value={values.numeroCuenta}
              placeholder="ESXX XXXX XXXX XXXX XXXX XXXX"
              keyboardType="default"
              autoCapitalize="characters"
            />
            {touched.numeroCuenta && errors.numeroCuenta && (
              <Text style={styles.formError}>{errors.numeroCuenta}</Text>
            )}
            <View style={styles.formNavigationButtonsContainer}>
              <PrimaryButton onPress={handleSubmit} title="Siguiente" />
              <SecondaryButton
                title="Atrás"
                onPress={() => navigation.goBack()}
              />
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

export default StepNumeroCuenta;
