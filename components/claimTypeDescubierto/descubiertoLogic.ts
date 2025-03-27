import AsyncStorage from "@react-native-async-storage/async-storage";

import { firestore, getCurrentUserId } from "@/firebase.config";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";

// Inicializa los datos en firestore
export const handleBankStepEvent = async (
  data: Record<string, any>,
  claimId: string | null = null
) => {
  //   console.log("Evento personalizado para el paso bank:", data);
  if (claimId !== null) {
    if (data[claimId].entidadBancaria) {
      setDataToFirestore(
        claimId,
        "6b",
        "entidadBancaria",
        data[claimId].entidadBancaria
      );
    }
  } else {
    if (data["6b"].entidadBancaria) {
      try {
        const docRef = await initDataToFirestore(data["6b"].entidadBancaria);
        //   console.log(docRef);
        if (!docRef) {
          console.error("Error al crear el documento en Firestore");
          return;
        } else {
          const formData = JSON.parse(
            (await AsyncStorage.getItem("formData")) || "{}"
          );
          formData[docRef.id] = formData["6b"];
          delete formData["6b"];
          await AsyncStorage.setItem("formData", JSON.stringify(formData));

          return docRef.id;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};

export const handleNumeroCuentaStepEvent = async (
  data: Record<string, any>,
  claimId: string | null = null
) => {
  // console.log("Evento personalizado para el paso numeroCuenta:", data);
  if (claimId !== null) {
    if (data[claimId].numeroCuenta) {
      setDataToFirestore(
        claimId,
        "8",
        "numeroCuenta",
        data[claimId].numeroCuenta
      );
    }
  }
};
/**
 * 
 * @param data       
      { id: "10", component: StepQuienEnvia, isBranching: true },
      { id: "11", component: StepUploadDNI },
      { id: "12", component: StepDNI },
      { id: "14", component: StepConfirmarDireccion },
      { id: "15", component: StepRevisionDocumentos },
      { id: "16", component: StepPeticionPR },
      { id: "17", component: StepGenerarDocumentos },
 * @param claimId 
 */
export const handleComisionesStepEvent = async (
  data: Record<string, any>,
  claimId: string | null = null
) => {
  //   console.log("Evento personalizado para el paso comisiones:", data);

  if (claimId !== null) {
    if (data[claimId].comisiones) {
      setDataToFirestore(claimId, "9", "comisiones", data[claimId].comisiones);
    }
  }
};

export const handleDNIStepEvent = async (
  data: Record<string, any>,
  claimId: string | null = null
) => {
  //   console.log("Evento personalizado para el paso DNI:", data);

  if (claimId !== null) {
    if (data[claimId].nombreCompleto) {
      setDataToFirestore(claimId, "12", "dni", data[claimId].dni);
    }
    if (data[claimId].nombreCompleto) {
      setDataToFirestore(
        claimId,
        "12",
        "nombreCompleto",
        data[claimId].nombreCompleto
      );
    }
    if (data[claimId].userId) {
      setDataToFirestore(claimId, "12", "userId", data[claimId].userId);
    }
  }
};

export const handleConfirmarDireccionStepEvent = async (
  data: Record<string, any>,
  claimId: string | null = null
) => {
  //   console.log("Evento personalizado para el paso Direccion:", data);

  if (claimId !== null) {
    if (data[claimId].address) {
      setDataToFirestore(claimId, "14", "address", data[claimId].address);
    }
  }
};
export const handleQuienEnviaStepEvent = async (
  data: Record<string, any>,
  claimId: string | null = null
) => {
  //   console.log("Evento personalizado para el paso QuienEnvia:", data);

  if (claimId !== null) {
    if (data[claimId].whoSends) {
      setDataToFirestore(claimId, "10", "whoSends", data[claimId].whoSends);
    }
  }
};

export const handlePeticionPRStepEvent = async (
  data: Record<string, any>,
  claimId: string | null = null
) => {
  console.log("Evento personalizado para el paso PR:");

//   console.log(claimId);
//   console.log(data);
  if (
    claimId !== null &&
    data.hasOwnProperty(claimId) &&
    data[claimId].hasOwnProperty("hasPR")
  ) {
    await setDataToFirestore(claimId, "15", "hasPR", data[claimId].hasPR);
  }
};

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
        currentStep: "6b",
      }
    );
    console.log("Reclamacion creada con ID: ", docRef.id);
    return docRef; // Retornamos docRef para obtener el ID en handleSubmit
  } catch (error) {
    console.error("Error al guardar en Firestore: ", error);
    throw error; // Importante lanzar el error para que handleSubmit pueda capturarlo
  }
};

const setDataToFirestore = async (
  docId: string,
  stepId: string,
  key: string,
  value: string
) => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(firestore, `usuarios/${userId}/reclamaciones/${docId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      await setDoc(
        docRef,
        { currentStep: stepId, [key]: value },
        { merge: true }
      );
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error al guardar en Firestore: ", error);
    throw error;
  }
};
