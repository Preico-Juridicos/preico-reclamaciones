import {
  View,
  Text,
  Switch,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import createStyles from "@/assets/styles/themeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from "@/api/firebase";
import { firestore } from "@/firebase.config";

export default function UserId() {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const navigation = useNavigation();
  const [showUsername, setShowUsername] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleShowUsername = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, "usuarios", user.uid);
        await updateDoc(docRef, { showUsername: !showUsername });
        setShowUsername((prev) => !prev);
      } else {
        Alert.alert("Error", "Usuario no autenticado.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la preferencia.");
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    // Aquí puedes integrar lógica para actualizar las preferencias de notificaciones
  };

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
              Alert.alert("Error", "No se pudo eliminar la cuenta.");
            }
          },
        },
      ]
    );
  };

  const manageData = () => {
    navigation.navigate("user/gdpr"); // Supone que tienes una pantalla para la gestión de datos según GDPR
  };

  const localStyles = StyleSheet.create({
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    settingLabel: {
      fontSize: 16,
      color: styles.text.color,
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
    contentContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.screenMainContainer}>
      <View>
        <Text style={styles.screenTitle}>Ajustes</Text>
      </View>
      <View style={localStyles.contentContainer}>
        <View style={localStyles.settingItem}>
          <Text style={localStyles.settingLabel}>
            Mostrar nombre de usuario
          </Text>
          <Switch value={showUsername} onValueChange={toggleShowUsername} />
        </View>

        <View style={localStyles.settingItem}>
          <Text style={localStyles.settingLabel}>Notificaciones</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
      </View>
      <View style={localStyles.contentContainer}>
        <TouchableOpacity
          style={localStyles.settingButton}
          onPress={manageData}
        >
          <Text style={localStyles.settingButtonText}>
            Gestión de datos (GDPR)
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
  );
}
