import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import Dialog from "react-native-dialog";
import { sendBankEmailNotification } from "../../services/emailService";
import { createStyles } from "../../constants/styles";

import { firestore, getCurrentUserId } from "../../constants/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const StepBanco = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  const [banks, setBanks] = useState([]); // Lista de bancos obtenidos
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [bankInput, setBankInput] = useState("");

  useEffect(() => {
    //   Al cargar el componente, obtenemos la lista de bancos
    const fetchBanks = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "bancos"));
        const banksData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            label: data.banco_nombre_comercial || data.banco_nombre,
            value: doc.id,
          };
        });
        setBanks(banksData);
      } catch (error) {
        console.error("Error fetching bancos:", error);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    if (currentStep !== 8) {
      updateStep(8);
    }
  }, [currentStep, updateStep]);

  const initDataToFirestore = async () => {
    try {
      const userId = getCurrentUserId();
      const docRef = await addDoc(
        collection(firestore, `usuarios/${userId}/reclamaciones`),
        {
          tipo: "descubierto",
          fecha_reclamacion: new Date(),
          userId: userId,
          entidadBancaria: value,
          currentStep: "StepBanco",
        }
      );
      console.log("Reclamacion creada con ID: ", docRef.id);
      return docRef; // Retornamos docRef para obtener el ID en handleSubmit
    } catch (error) {
      console.error("Error al guardar en Firestore: ", error);
      throw error; // Importante lanzar el error para que handleSubmit pueda capturarlo
    }
  };

  const handleSubmit = async (values) => {
    try {
      //Se crean los datos en Firestore
      const docRef = await initDataToFirestore();
      // Se crean los datos en AsyncStorage
      const existingData = await AsyncStorage.getItem("formData");
      const formData = existingData ? JSON.parse(existingData) : {};
      const updatedData = { ...formData, [docRef.id]: values };
      await AsyncStorage.setItem("formData", JSON.stringify(updatedData));
// console.log(JSON.stringify(updatedData));
      navigation.navigate("StepNumeroCuenta");
    } catch (error) {
      console.error(error);
    }
  };

  const noEncuentroMiBanco = () => {
    setDialogVisible(true);
  };
  const handleDialogSubmit = async () => {
    try {
      await sendBankEmailNotification(bankInput);
      setDialogVisible(false);
      setBankInput("");

      Alert.alert(
        "Mensaje enviado",
        "Revisaremos tu solicitud y añadiremos tu banco."
      );
    } catch (error) {
      console.error("Error sending notification:", error);

      Alert.alert(
        "Error",
        "Ha habido un error al enviar tu solicitud. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Selecciona tu entidad bancaria.
      </Text>

      <Formik
        initialValues={{ entidadBancaria: "" }}
        validationSchema={Yup.object().shape({
          entidadBancaria: Yup.string().required(
            "Recuerda seleccionar una entidad Bancaria."
          ),
        })}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Dropdown
              style={[
                styles.dropdownContainer,
                isFocus && {
                  borderWidth: 1,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              ]}
              data={banks}
              search
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Selecciona una opción" : "..."}
              searchPlaceholder="Escribe para buscar"
              value={values.entidadBancaria}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value);
                setIsFocus(false);
                setFieldValue("entidadBancaria", item.value);
              }}
            />
            <Text
              style={[styles.link, { textAlign: "center", marginVertical: 20 }]}
              onPress={noEncuentroMiBanco}
            >
              ¿No encuentras tu banco? Avísanos
            </Text>
            {touched.entidadBancaria && errors.entidadBancaria && (
              <Text style={pageStyles.error}>{errors.entidadBancaria}</Text>
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
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title style={pageStyles.dialogTitle}>
          No encuentro mi banco
        </Dialog.Title>
        <Dialog.Description style={pageStyles.dialogDescription}>
          Introduce el nombre de tu banco para notificarnos.
        </Dialog.Description>
        <Dialog.Input
          placeholder="Nombre del banco"
          value={bankInput}
          onChangeText={setBankInput}
          style={pageStyles.dialogInput}
        />
        <Dialog.Button
          label="Cancelar"
          onPress={() => setDialogVisible(false)}
        />
        <Dialog.Button label="Enviar" onPress={handleDialogSubmit} />
      </Dialog.Container>
    </ScrollView>
  );
};

const pageStyles = StyleSheet.create({
  dialogTitle: {
    color: "#333",
    textAlign: "center",
  },
  dialogDescription: {
    color: "#333",
    textAlign: "justify",
  },
  dialogInput: {
    marginBottom: 10,
    color: "#333",
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default StepBanco;
