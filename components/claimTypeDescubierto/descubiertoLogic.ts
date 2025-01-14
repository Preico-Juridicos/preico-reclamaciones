import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { firestore, getCurrentUserId } from "@/firebase.config";
import { collection, addDoc } from "firebase/firestore";

// Inicializa los datos en firestore
export const handleBankStepEvent = async (data: Record<string, any>) => {
  const router = useRouter();
  console.log("Evento personalizado para el paso bank:", data);
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("No hay usuario autenticado");
    router.push("/home");
    return;
  }

  if (data.entidadBancaria) {
    try {
      const docRef = await initDataToFirestore(data.entidadBancaria);
      console.log(docRef);
      if (!docRef) {
        console.error("Error al crear el documento en Firestore");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const handleCustomEventForStep3 = async (data: Record<string, any>) => {
  console.log("Evento personalizado para el paso 3:", data);
};

// Agrega más funciones según sea necesario

//Funciones intermedias
const initDataToFirestore = async (value: string) => {
  try {
    const userId = getCurrentUserId();

    const docRef = await addDoc(
      collection(firestore, `usuarios/${userId}/reclamaciones`),
      {
        tipo: "descubierto",
        fecha_reclamacion: new Date(),
        userId: userId,
        entidadBancaria: value,
        currentStep: "StepBanco",
      }
    );
    console.log("Reclamacion creada con ID: ", docRef.id);
    return docRef; // Retornamos docRef para obtener el ID en handleSubmit
  } catch (error) {
    console.error("Error al guardar en Firestore: ", error);
    throw error; // Importante lanzar el error para que handleSubmit pueda capturarlo
  }
};
