import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Dialog from "react-native-dialog";
import { sendBankEmailNotification } from "@api/emailService";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

import { firestore } from "@/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean
  ) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
  claimCode?: string;
};

const StepBanco: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [banks, setBanks] = useState<{ label: string; value: string }[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const [isFocus, setIsFocus] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [bankInput, setBankInput] = useState("");

  useEffect(() => {
    setCanContinue(false);
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

    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("formData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          let entidadBancaria = parsedData.entidadBancaria;
          if (claimCode && parsedData[claimCode]?.entidadBancaria) {
            entidadBancaria = parsedData[claimCode].entidadBancaria;
            setSelectedBank(entidadBancaria);
            setCanContinue(true);
          }

          //   if (entidadBancaria) {
          //     updateData(stepId, { ...data, entidadBancaria });
          //   }
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    fetchBanks();
    loadStoredData();
  }, [claimCode]);

  useEffect(() => {
    if (banks.length > 0 && data.entidadBancaria) {
      const existingBank = banks.find(
        (bank) => bank.value === data.entidadBancaria
      );
      if (existingBank) {
        setSelectedBank(existingBank.value);
        setCanContinue(true);
      }
    }
  }, [banks, data.entidadBancaria]);

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
      <Text style={styles.formTitle}>Selecciona tu entidad bancaria.</Text>

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
        value={selectedBank}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          updateData(stepId, { ...data, entidadBancaria: item.value });
          setSelectedBank(item.value);
          setIsFocus(false);
          setCanContinue(true);
        }}
      />
      <Text
        style={[styles.link, { textAlign: "center", marginVertical: 20 }]}
        onPress={noEncuentroMiBanco}
      >
        ¿No encuentras tu banco? Avísanos
      </Text>

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
