import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Añadir getFirestore
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

  const [initialValues, setInitialValues] = useState({
    address: "",
  });

  useEffect(() => {
    setCanContinue(false);

    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("formData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          let address = parsedData.address;
          if (claimCode && parsedData[claimCode]?.address) {
            address = parsedData[claimCode].address;
            setInitialValues(address);
            updateData(stepId, { address: address }, true);
            setCanContinue(true);
          }
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, [claimCode]);

  useEffect(() => {
    const fetchExternalData = async () => {
      try {
        const userId = getCurrentUserId();
        // console.log("userId", userId);
        if (userId) {
          const userData = await getUserData(userId);
          const existingData = await AsyncStorage.getItem("formData");
          if (existingData !== null) {
            const formData = JSON.parse(existingData);
            const computedAddress = formData.address || userData?.address;
            setInitialValues({ address: computedAddress });
            updateData(stepId, { address: computedAddress }, true);
            setCanContinue(true);
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

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Tu dirección es "{initialValues.address}"?
      </Text>

      <View>
        <Text style={styles.formLabel}>
          Si tu dirección no es correcta aqui puedes cambiarla.
        </Text>
        <TextInput
          style={styles.formInput}
          value={initialValues.address}
          placeholder="Dirección"
          keyboardType="default"
          autoCapitalize="characters"
        />
      </View>
    </ScrollView>
  );
};

export default StepConfirmarDireccion;
