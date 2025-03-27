import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

import { useFocusEffect } from "@react-navigation/native"; // Importar el hook de navegación

const StepComisiones = ({ navigation, currentStep, updateStep }) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  // Estado para los valores iniciales cargados de AsyncStorage
  const [fetchedValues, setFetchedValues] = useState({
    comisiones: [{ fecha: "", importe: "" }],
  });
  const [total, setTotal] = useState(0);
  const [openDatePickerIndex, setOpenDatePickerIndex] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formikKey, setFormikKey] = useState(0); // Clave dinámica para forzar re-inicialización de Formik

  useEffect(() => {
    if (currentStep !== 10) {
      updateStep(10);
    }
  }, [currentStep, updateStep]);

  // Utilizamos useFocusEffect para cargar los datos cada vez que la pantalla esté en foco
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await AsyncStorage.getItem("formData");
          if (data !== null) {
            const formData = JSON.parse(data);
            const normalizedComisiones = formData.comisiones
              ? formData.comisiones.map((comision) => ({
                  ...comision,
                  importe: comision.importe ? comision.importe.toString() : "",
                }))
              : [{ fecha: "", importe: "" }];

            setFetchedValues({
              comisiones: normalizedComisiones,
            });
            updateTotal(normalizedComisiones);
            setFormikKey((prevKey) => prevKey + 1); // Actualizamos la clave para forzar la re-inicialización de Formik
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []) // Se pasa un array vacío para asegurar que solo se llame cuando la pantalla se enfoca
  );

  const updateTotal = (comisiones) => {
    const suma = comisiones.reduce(
      (acc, curr) =>
        acc + (isNaN(parseFloat(curr.importe)) ? 0 : parseFloat(curr.importe)),
      0
    );
    setTotal(suma);
  };

  const validationSchema = Yup.object().shape({
    comisiones: Yup.array().of(
      Yup.object().shape({
        fecha: Yup.string()
          .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            "Formato de fecha inválido (YYYY-MM-DD)"
          )
          .required("Fecha es requerida"),
        importe: Yup.number()
          .typeError("Debe ser un número")
          .positive("Debe ser un número positivo")
          .required("Importe es requerido"),
      })
    ),
  });

  const handleDateConfirm = (index, date, setFieldValue) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFieldValue(`comisiones[${index}].fecha`, formattedDate);
    setOpenDatePickerIndex(null);
  };

  const handleDismiss = () => {
    setOpenDatePickerIndex(null);
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Añade los cargos y fechas de las comisiones
      </Text>
      <Formik
        key={formikKey} // Clave dinámica para forzar re-inicialización
        initialValues={
          fetchedValues || { comisiones: [{ fecha: "", importe: "" }] }
        }
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            values.comisiones = values.comisiones.map((comision) => ({
              ...comision,
              importe: parseFloat(comision.importe) || 0,
            }));

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
            navigation.navigate("StepQuienEnvia");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
          setFieldValue,
        }) => {
          useEffect(() => {
            if (values.comisiones && Array.isArray(values.comisiones)) {
              updateTotal(values.comisiones);
            }
          }, [values.comisiones]);

          return (
            <>
              <FieldArray name="comisiones">
                {({ push, remove }) => (
                  <View>
                    {values.comisiones &&
                      Array.isArray(values.comisiones) &&
                      values.comisiones.map((comision, index) => (
                        <View
                          key={index}
                          style={[pageStyles.comisionRow, { width: "100%" }]}
                        >
                          <TouchableOpacity
                            style={[pageStyles.dateButton, { flex: 1 }]}
                            onPress={() => {
                              setOpenDatePickerIndex(index);
                              setSelectedDate(
                                comision.fecha
                                  ? new Date(comision.fecha)
                                  : new Date()
                              );
                              setIsDatePickerVisible(true);
                            }}
                          >
                            <Text
                              style={
                                comision.fecha
                                  ? pageStyles.dateText
                                  : pageStyles.placeholderText
                              }
                            >
                              {comision.fecha || "Fecha"}
                            </Text>
                          </TouchableOpacity>

                          {openDatePickerIndex === index && (
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              date={selectedDate}
                              onConfirm={(date) => {
                                handleDateConfirm(
                                  openDatePickerIndex,
                                  date,
                                  setFieldValue
                                );
                                setIsDatePickerVisible(false);
                              }}
                              onCancel={() => setIsDatePickerVisible(false)}
                            />
                          )}

                          <TextInput
                            style={[pageStyles.inputSmall, { flex: 1 }]}
                            onChangeText={(text) => {
                              setFieldValue(
                                `comisiones[${index}].importe`,
                                text
                              );
                            }}
                            onBlur={() => {
                              const importe = parseFloat(
                                values.comisiones[index].importe
                              );
                              if (!isNaN(importe)) {
                                setFieldValue(
                                  `comisiones[${index}].importe`,
                                  importe.toString()
                                );
                              }
                            }}
                            value={values.comisiones[index].importe}
                            placeholder="Importe"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                          />

                          {values.comisiones.length > 1 && (
                            <TouchableOpacity
                              onPress={() => remove(index)}
                              style={[
                                pageStyles.removeButtonSmall,
                                { flex: 0.5 },
                              ]}
                            >
                              <Text style={pageStyles.removeText}>-</Text>
                            </TouchableOpacity>
                          )}

                          {index === values.comisiones.length - 1 && (
                            <TouchableOpacity
                              onPress={() => push({ fecha: "", importe: "" })}
                              style={[pageStyles.addButtonSmall, { flex: 0.5 }]}
                            >
                              <Text style={pageStyles.addText}>+</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      ))}
                  </View>
                )}
              </FieldArray>

              <Text style={pageStyles.total}>
                Total Importes: {total.toFixed(2)} €
              </Text>
              <View style={styles.formNavigationButtonsContainer}>
                <PrimaryButton onPress={handleSubmit} title="Siguiente" />
                <SecondaryButton
                  title="Atrás"
                  onPress={() => navigation.goBack()}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

const pageStyles = StyleSheet.create({
  comisionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    fontSize: 16,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 5,
  },
  dateText: {
    color: "#000",
    fontSize: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  removeButtonSmall: {
    backgroundColor: "#ff4d4d",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  removeText: { fontSize: 26, color: "#fff" },
  addButtonSmall: {
    backgroundColor: "#4caf50",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  addText: {
    fontSize: 26,
    color: "#fff",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
  },
});

export default StepComisiones;
