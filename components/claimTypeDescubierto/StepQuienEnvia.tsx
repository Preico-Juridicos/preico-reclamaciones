import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { ButtonGroup } from "@rneui/themed";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

import { getCurrentUserId, getUserData } from "@/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean
  ) => void;
  setCanContinue: (canContinue: boolean) => void;
  claimCode?: string;
};

const StepQuienEnvia: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const options = [
    "La enviaré yo mismo",
    "Prefiero que lo gestione Preico Jurídicos",
  ];
  const values = ["yo", "preico"];

  useEffect(() => {
    if (selectedIndex !== null) {
      console.log("whoSends", values[selectedIndex]);
      updateData(stepId, { whoSends: values[selectedIndex] }, true);
      setCanContinue(true); // Ahora debería actualizarse correctamente en el componente padre
    } else {
      setCanContinue(false);
    }
  }, [selectedIndex, setCanContinue]);

  useEffect(() => {
    setCanContinue(false);
    const fetchExternalData = async () => {
      try {
        const userId = getCurrentUserId();
        if (userId) {
          const existingData = await AsyncStorage.getItem("formData");
          if (existingData) {
            const formData = JSON.parse(existingData);
            let who = formData.whoSends || "";
            if (claimCode && formData[claimCode]?.whoSends) {
              who = formData[claimCode].whoSends;
            }
            const index = values.indexOf(who);
            setSelectedIndex(index !== -1 ? index : null);
            setCanContinue(index !== -1);
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
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>¿Quién enviará la reclamación?</Text>
      <ButtonGroup
        buttons={options}
        selectedIndex={selectedIndex}
        onPress={(value) => setSelectedIndex(value)}
        vertical={true}
        containerStyle={{
          marginBottom: 20,
          gap: 10,
          backgroundColor: styles.background.backgroundColor,
          borderWidth: 0,
        }}
        buttonStyle={[
          styles.buttonPrimary,
          { borderWidth: 1, borderColor: styles.buttonPrimaryText.color },
        ]}
        selectedButtonStyle={[
          styles.buttonSecondary,
          { borderColor: styles.buttonSecondaryText.color },
        ]}
        textStyle={styles.buttonPrimaryText}
        selectedTextStyle={styles.buttonSecondaryText}
        innerBorderStyle={{ width: 0 }}
      />
    </ScrollView>
  );
};

export default StepQuienEnvia;
