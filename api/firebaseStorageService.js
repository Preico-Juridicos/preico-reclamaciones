import storage from "@react-native-firebase/storage";

export const uploadDniToFirebase = async (dniFrontUri, dniBackUri) => {
  const userId = "123456"; // Puedes obtener el userId dinámicamente si lo necesitas

  const uploadImage = async (uri, filename) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage().ref().child(`dni/${userId}/${filename}`);
    await ref.put(blob);
    return ref.getDownloadURL(); // Devuelve la URL del archivo subido
  };

  const frontUrl = await uploadImage(dniFrontUri, "dniFront.jpg");
  const backUrl = await uploadImage(dniBackUri, "dniBack.jpg");

  return { frontUrl, backUrl }; // Retorna las URLs de las imágenes subidas
};
