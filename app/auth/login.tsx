import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/firebase.config";

import { BackHandler } from "react-native";
import { useNavigation } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

export default function login() {
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const navigation = useNavigation();

  useEffect(() => {
    // Para logearme rapido solo en dev
    setEmail("preicodev@gmail.com");
    setPassword("123456");

    // Evita que el boton de atras vaya a la home
    BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
  }, []);

  async function handleLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario autenticado:", user.email);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  }

  return (
    <View
      style={[
        style.mainContainer,
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
      ]}
    >
      <TextInput
        style={[style.formInput, { width: "100%" }]}
        placeholder="Correo Electrónico"
        placeholderTextColor={style.text.color}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[style.formInput, { width: "100%" }]}
        placeholder="Contraseña"
        placeholderTextColor={style.text.color}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={style.formButton} onPress={handleLogin}>
        <Text style={style.formButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("auth/register")}
        style={{ marginTop: 20 }}
      >
        <Text style={style.formLink}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}
