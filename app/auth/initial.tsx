import { useEffect } from "react";
import { useRouter } from "expo-router";
import { auth } from "@api/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";

export default function initial() {
  const router = useRouter();

  useEffect(() => {
    // Escucha el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/home"); // Redirige a Home si el usuario está autenticado
      } else {
        router.push("/auth/login"); // Redirige a Login si no lo está
      }
    });

    // Limpia el listener
    return () => unsubscribe();
  }, [router]);


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
