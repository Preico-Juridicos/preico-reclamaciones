import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
  } from "react-native";
  import { useState } from "react";
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { app } from "@/firebase.config";
  import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
  import { useNavigation } from "expo-router";
  import { useTheme } from "@/contexts/ThemeContext";
  import createStyles from "@/assets/styles/themeStyles";
  import { FirebaseError } from "firebase/app";
  
  export default function Register() {
    const { isDarkMode } = useTheme();
    const style = createStyles(isDarkMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
  
    const auth = getAuth(app);
    const db = getFirestore(app);
    const navigation = useNavigation();
  
    async function handleSignUp() {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden.");
        return;
      }
  
      try {
        // Registrar usuario con Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
  
        // Crear documento en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
          username,
          email,
          createdAt: new Date().toISOString(),
        });
  
        // Crear colección "configuraciones" dentro del usuario
        const userConfigRef = collection(db, `usuarios/${user.uid}/configuraciones`);
        await setDoc(doc(userConfigRef, "privacidad"), {
          analyticsConsent: false,
          marketingConsent: false,
          functionalConsent: false,
          deleteRequest: false,
          deleteRequestDate: null,
          notificationsEnabled: true,
          showUserName: true,
        });
  
        console.log("Usuario registrado y configuraciones creadas:", user.email);
        Alert.alert("Registro exitoso", "Usuario creado correctamente");
        // navigation.navigate("auth/login");
      } catch (error) {
        const firebaseError = error as FirebaseError;
        console.error("Error al registrar usuario:", firebaseError.message);
        Alert.alert("Error", firebaseError.message);
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
          placeholder="Nombre de usuario"
          placeholderTextColor={style.text.color}
          onChangeText={setUsername}
          value={username}
        />
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
        <TextInput
          style={[style.formInput, { width: "100%" }]}
          placeholder="Confirmar Contraseña"
          placeholderTextColor={style.text.color}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={style.formButton} onPress={handleSignUp}>
          <Text style={style.formButtonText}>Registrar</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={() => navigation.navigate("auth/login")}
          style={{ marginTop: 20 }}
        >
          <Text style={style.formLink}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    );
  }
