import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function GDPR() {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [functionalConsent, setFunctionalConsent] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchConfig = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }

      try {
        const configDoc = await getDoc(doc(db, `usuarios/${user.uid}/configuraciones/privacidad`));
        if (configDoc.exists()) {
          const configData = configDoc.data();
          setAnalyticsConsent(configData.analyticsConsent || false);
          setMarketingConsent(configData.marketingConsent || false);
          setFunctionalConsent(configData.functionalConsent || false);
        } else {
          Alert.alert("Error", "No se encontraron configuraciones de privacidad.");
        }
      } catch (error) {
        console.error("Error al obtener configuraciones:", error);
        Alert.alert("Error", "No se pudieron obtener las configuraciones de privacidad.");
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado.");
      return;
    }

    try {
      await updateDoc(doc(db, `usuarios/${user.uid}/configuraciones/privacidad`), {
        analyticsConsent,
        marketingConsent,
        functionalConsent,
      });
    } catch (error) {
      console.error("Error al guardar configuraciones:", error);
      Alert.alert("Error", "No se pudieron guardar las configuraciones.");
    }
  };

  const localStyles = StyleSheet.create({
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? "#444" : "#ccc",
    },
    settingLabel: {
      fontSize: 16,
      color: styles.text.color,
    },
    saveButton: {
      marginTop: 20,
      paddingVertical: 15,
      alignItems: "center",
      backgroundColor: isDarkMode ? "#4CAF50" : "#007BFF",
      borderRadius: 5,
    },
    saveButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    contentContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.screenMainContainer}>
      <Text style={styles.screenTitle}>Gestión de Privacidad (GDPR)</Text>
      <View style={localStyles.contentContainer}>
        <View style={localStyles.settingItem}>
          <Text style={localStyles.settingLabel}>Consentimiento para Analytics</Text>
          <Switch
            value={analyticsConsent}
            onValueChange={(value) => setAnalyticsConsent(value)}
          />
        </View>
        <View style={localStyles.settingItem}>
          <Text style={localStyles.settingLabel}>Consentimiento para Marketing</Text>
          <Switch
            value={marketingConsent}
            onValueChange={(value) => setMarketingConsent(value)}
          />
        </View>
        <View style={localStyles.settingItem}>
          <Text style={localStyles.settingLabel}>Consentimiento para Funcionalidades</Text>
          <Switch
            value={functionalConsent}
            onValueChange={(value) => setFunctionalConsent(value)}
          />
        </View>
        <TouchableOpacity style={localStyles.saveButton} onPress={handleSave}>
          <Text style={localStyles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
