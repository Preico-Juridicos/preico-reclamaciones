import {
  View,
  Text,
  Switch,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";
import { auth } from "@/api/firebase";
import { firestore } from "@/firebase.config";

export default function UserId() {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showUsername, setShowUsername] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConfig = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }

      try {
        const configDoc = await getDoc(
          doc(firestore, `usuarios/${user.uid}/configuraciones/privacidad`)
        );
        if (configDoc.exists()) {
          const configData = configDoc.data();
          setNotificationsEnabled(configData.notificationsEnabled || false);
          setShowUsername(configData.showUsername || true);
        } else {
          Alert.alert(
            "Error",
            "No se encontraron configuraciones de privacidad."
          );
        }
      } catch (error) {
        console.error("Error al obtener configuraciones:", error);
        Alert.alert(
          "Error",
          "No se pudieron obtener las configuraciones de privacidad."
        );
      }
    };

    fetchConfig();
  }, []);

  const toggleNotifications = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado.");
      return;
    }

    try {
      const newStatus = !notificationsEnabled;
      await updateDoc(
        doc(firestore, `usuarios/${user.uid}/configuraciones/privacidad`),
        {
          notificationsEnabled: newStatus,
        }
      );
      setNotificationsEnabled(newStatus);
    } catch (error) {
      console.error("Error al actualizar configuraciones:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar la preferencia de notificaciones."
      );
    }
  };

  const toggleShowUsername = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado.");
      return;
    }

    try {
      const newStatus = !showUsername;
      await updateDoc(
        doc(firestore, `usuarios/${user.uid}/configuraciones/privacidad`),
        {
          showUsername: newStatus,
        }
      );
      setShowUsername(newStatus);
    } catch (error) {
      console.error("Error al actualizar configuraciones:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar la preferencia de nombre de usuario."
      );
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
    contentContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    settingButton: {
      marginTop: 20,
      paddingVertical: 15,
      alignItems: "center",
      backgroundColor: "#007BFF",
      borderRadius: 5,
    },
    settingButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    deleteButton: {
      marginTop: 20,
      paddingVertical: 15,
      alignItems: "center",
      backgroundColor: "#FF3B30",
      borderRadius: 5,
    },
    deleteButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  const deleteAccount = async () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteDoc(doc(firestore, "usuarios", user.uid));
                await user.delete();
              } else {
                Alert.alert("Error", "Usuario no autenticado.");
              }
              Alert.alert(
                "Cuenta eliminada",
                "Tu cuenta ha sido eliminada correctamente."
              );
              navigation.reset({
                index: 0,
                routes: [{ name: "auth/initial" }],
              });
            } catch (error) {
              console.log(JSON.stringify(error));
              //   Alert.alert("Error", "No se pudo eliminar la cuenta.");
            }
          },
        },
      ]
    );
  };

  const manageData = () => {
    navigation.navigate("user/gdpr"); // Supone que tienes una pantalla para la gestión de datos según GDPR
  };

  return (
    <View style={styles.screenMainContainer}>
      <Text style={styles.screenTitle}>Ajustes de Privacidad</Text>
      <View style={localStyles.contentContainer}>
        <View style={localStyles.settingItem}>
          <Text style={localStyles.settingLabel}>
            Notificaciones habilitadas
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
        <View style={localStyles.settingItem}>
          <Text style={localStyles.settingLabel}>
            Mostrar nombre de usuario
          </Text>
          <Switch value={showUsername} onValueChange={toggleShowUsername} />
        </View>
        <View style={localStyles.contentContainer}>
          <TouchableOpacity
            style={localStyles.settingButton}
            onPress={manageData}
          >
            <Text style={localStyles.settingButtonText}>
              Gestión de Privacidad
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.deleteButton}
            onPress={deleteAccount}
          >
            <Text style={localStyles.deleteButtonText}>Eliminar cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
