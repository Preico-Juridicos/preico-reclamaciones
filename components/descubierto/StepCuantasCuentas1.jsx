import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStyles } from "../../constants/styles";

import QuantityInput from "../QuantityInput";
const StepCuantasCuentas1 = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  useEffect(() => {
    if (currentStep !== 7) {
      updateStep(7);
    }
  }, [currentStep, updateStep]);

  const [initialValues, setInitialValues] = useState({ cantidadCuentas: 1 });

  const validationSchema = Yup.object().shape({
    cantidadCuentas: Yup.number()
      .typeError("Debe ser un número")
      .required("Este campo es obligatorio"),
  });
  const handleSubmit = async (values) => {
    values.cantidadCuentas = Number(values.cantidadCuentas);
    console.log(values.cantidadCuentas);
    if (values.cantidadCuentas === 0) {
      Alert.alert(
        "Error",
        "El campo de cantidad de cuentas debe ser mayor a 0."
      );
      return;
    }
    try {
      const existingData = await AsyncStorage.getItem("formData");
      const formData = existingData ? JSON.parse(existingData) : {};

      const updatedData = { ...formData, ...values };
      await AsyncStorage.setItem("formData", JSON.stringify(updatedData));

      navigation.navigate("StepBanco");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchInitialValues = async () => {
      try {
        const data = await AsyncStorage.getItem("formData");
        if (data !== null) {
          const formData = JSON.parse(data);
          setInitialValues({ cantidadCuentas: formData.cantidadCuentas || 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitialValues();
  }, []);

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Indicanos en cuantas cuentas se aplicaron las comisiones
      </Text>
      <Text style={styles.formText}>
        Una vez finalices la reclamación actual, repetiremos el proceso para
        cada una de las cuentas bancarias que tengas. Por ello te pedimos que
        nos indiques en cuantas cuentas bancarias se han aplicado.
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
          <View>
            <QuantityInput
              min={1}
              max={10}
              value={values.cantidadCuentas.toString()}
              onChangeText={(value) => {
                handleChange("cantidadCuentas")(value);
              }}
            />
            {touched.cantidadCuentas && errors.cantidadCuentas && (
              <Text style={styles.error}>{errors.cantidadCuentas}</Text>
            )}
            <View style={{ gap: 10, marginTop: 10 }}>
              <PrimaryButton onPress={handleSubmit} title="Siguiente" />
              <SecondaryButton
                title="Atrás"
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default StepCuantasCuentas1;
