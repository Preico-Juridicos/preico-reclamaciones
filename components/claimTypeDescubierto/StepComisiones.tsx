import React, { useEffect, useState } from "react";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (stepId: string, data: Record<string, any>) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
};

const StepComisiones: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [total, setTotal] = useState(0);
  const [openDatePickerIndex, setOpenDatePickerIndex] = useState<number | null>(
    null
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setCanContinue(false);
    if (data.comisiones && data.comisiones.length > 0) {
      updateTotal(data.comisiones);
    }
  }, [data.comisiones, setCanContinue]);

  const updateTotal = (comisiones: any[]) => {
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

  const handleDateConfirm = (
    index: number,
    date: Date,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFieldValue(`comisiones[${index}].fecha`, formattedDate);
    setOpenDatePickerIndex(null);
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Añade los cargos y fechas de las comisiones
      </Text>
      <Formik
        initialValues={{
          comisiones: data.comisiones || [{ fecha: "", importe: "" }],
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          updateData(stepId, { ...data, comisiones: values.comisiones });
          goToStep("10");
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
            if (values.comisiones && values.comisiones.length > 0) {
              updateTotal(values.comisiones);
              const allFieldsValid = values.comisiones.every(
                (comision) => comision.fecha && comision.importe
              );
              setCanContinue(allFieldsValid);
            }
          }, [values.comisiones, setCanContinue]);

          return (
            <>
              <FieldArray name="comisiones">
                {({ push, remove }) => (
                  <View>
                    {values.comisiones &&
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
                                  index,
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
                            onChangeText={(text) =>
                              setFieldValue(`comisiones[${index}].importe`, text)
                            }
                            value={comision.importe}
                            placeholder="Importe"
                            keyboardType="numeric"
                          />

                          {values.comisiones.length > 1 && (
                            <TouchableOpacity
                              onPress={() => remove(index)}
                              style={[pageStyles.removeButtonSmall, { flex: 0.5 }]}
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
