import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { firestore, getCurrentUserId, getUserData } from "@/firebase.config";
import { useTheme } from "@/contexts/ThemeContext";
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

const StepConfirmarDireccion: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [phone, setPhone] = useState("");

  useEffect(() => {
    setCanContinue(false);

    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("formData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          let storedPhone = parsedData.phone;
          if (claimCode && parsedData[claimCode]?.phone) {
            storedPhone = parsedData[claimCode].phone;
          }

          if (storedPhone) {
            setPhone(storedPhone);
            updateData(stepId, { phone: storedPhone }, true);
            setCanContinue(true);
          }
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, [claimCode]);

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>Introduce tu numero de teléfono</Text>

      <View>
        <Text style={styles.formLabel}>
          Introduce el número de teléfono que quieres utilizar para firmar los
          documentos de forma online.
        </Text>
        <TextInput
          style={styles.formInput}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            updateData(stepId, { phone: text }, true);
            setCanContinue(true);
          }}
          placeholder="Número de teléfono"
          keyboardType="phone-pad"
        />
      </View>
    </ScrollView>
  );
};

export default StepConfirmarDireccion;
