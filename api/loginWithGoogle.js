import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../constants/firebaseConfig";
import { useNavigation } from '@react-navigation/native'; // Para usar la navegación


export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "405929246902-8h6kpo7iiljsocab0aij3vr04ufmop2d.apps.googleusercontent.com",
  });

  const navigation = useNavigation(); // Obtener acceso a la navegación

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("Inicio de sesión exitoso:", userCredential.user);
          // Redirigir a la pantalla deseada, como por ejemplo "DniUploadScreen"
          navigation.navigate('DniUploadScreen');
        })
        .catch((error) => {
          console.error("Error en el inicio de sesión con Google:", error);
        });
    }
  }, [response]);

  return { request, promptAsync };
}
