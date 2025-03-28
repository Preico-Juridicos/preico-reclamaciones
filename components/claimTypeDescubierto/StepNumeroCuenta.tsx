import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createStyles from "@/assets/styles/themeStyles";

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

const StepNumeroCuenta: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [numeroCuenta, setNumeroCuenta] = useState(data.numeroCuenta || "");

  useEffect(() => {
    const isValid = /^ES\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(
      numeroCuenta
    );
    setCanContinue(isValid);
  }, [numeroCuenta, setCanContinue]);

  useEffect(() => {
    setCanContinue(false);

    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("formData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          let numeroCuenta = parsedData.numeroCuenta;
          if (claimCode && parsedData[claimCode]?.numeroCuenta) {
            numeroCuenta = parsedData[claimCode].numeroCuenta;
            setNumeroCuenta(numeroCuenta);
          }
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, [claimCode]);

  const handleInputChange = (value: string) => {
    setNumeroCuenta(value);
    updateData(stepId, { numeroCuenta: value }, true);
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
      <TextInput
        style={[
          styles.formInput,
          { marginTop: 20 },
          !/^ES\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(
            numeroCuenta
          ) &&
            numeroCuenta && { borderColor: styles.formError.backgroundColor },
        ]}
        onChangeText={handleInputChange}
        value={numeroCuenta}
        placeholder="ESXX XXXX XXXX XXXX XXXX XXXX"
        keyboardType="default"
        autoCapitalize="characters"
      />
      {!/^ES\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(
        numeroCuenta
      ) &&
        numeroCuenta && (
          <Text style={styles.formError}>
            Debe ser un número de cuenta válido (Formato: ESXX XXXX XXXX XXXX
            XXXX XXXX)
          </Text>
        )}
    </ScrollView>
  );
};

export default StepNumeroCuenta;
