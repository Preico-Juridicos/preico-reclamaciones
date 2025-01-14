import axios from "axios";

// Función para subir la imagen y luego escanearla
export const scanDocument = async (dniBackUri) => {
  try {
    // Convierte la imagen a un blob
    const response = await fetch(dniBackUri);
    const fileBlob = await response.blob();

    // Usa FormData para enviar la imagen como multipart/form-data
    let formData = new FormData();
    formData.append("file", {
      uri: dniBackUri,
      type: "image/jpeg", // Asegúrate de ajustar el tipo de archivo
      name: "dniBack.jpg",
    });

    // Subir el archivo a la API
    const uploadResult = await axios.post(
      "https://api.totalum.app/api/v1/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "api-key":
            "sk-eyJrZXkiOiIyNzY3ZmUxOGZmOWYwMDc4MWQ3YzJiZDkiLCJuYW1lIjoiRGVmYXVsdCBBUEkgS2V5IGF1dG9nZW5lcmF0ZWQgdm13YiIsIm9yZ2FuaXphdGlvbklkIjoicHJlaWNvLWp1cmlkaWNvcy1mZXkzIn0_",
        },
      }
    );

    const fileNameId = uploadResult.data.data; // ID del archivo subido

    // Definir las propiedades que deseas extraer del documento
    const properties = {
      name: { type: "string", description: "Nombre visible en el documento" },
      surnames: {
        type: "string",
        description: "Apellidos visibles en el documento",
      },
      nationality: {
        type: "string",
        description: "Nacionalidad de la persona",
      },
      gender: {
        type: "string",
        enum: ["M", "F"],
        description: "Género ('M' para hombre, 'F' para mujer)",
      },
      idNumber: { type: "string", description: "Número de identificación que puede venir en formato DNI con 8 numeros y 1 letra si o si es NIE con X,Y,Z + 7 numeros + 1 letra" },
      bornDate: {
        type: "string",
        format: "date",
        description: "Fecha de nacimiento que tiene formato DD MM AAAA",
      },
      expireDate: {
        type: "string",
        format: "date",
        description: "Fecha de validez del documento con formato DD MM AAAA ",
      },
      address: {
        type: "string",
        description: "Dirección visible en el documento",
      },
    };

    // Opciones para el escaneo del documento
    const scanOptions = {
      removeFileAfterScan: false, // set to true if you want to remove the file after the scan
      returnOcrFullResult: false, // set to true if you want to return the full OCR result
      maxPages: 1, // set the maximum number of pages to scan in a PDF file
      model: "scanum-eye-pro", // models available: 'scanum' < Para PDF, 'scanum-eye', 'scanum-eye-pro' < Para Imagenes
      //pdfPages: [1, 5, 10] // set the pages to scan in a PDF file, example: [1, 5, 10] (only scan pages 1, 5 and 10)
      //scanDescription: 'your description here' // set a additional description for add more context to what to scan and how to obtain it.
      //processEveryPdfPageAsDifferentScan: false // set to true if you want to process every page of a PDF as a different scan (the result will be an array of objects)
    };

    // Realizar la solicitud para escanear el documento
    const scanResult = await axios.post(
      "https://api.totalum.app/api/v1/files/scan-document",
      {
        fileName: fileNameId,
        properties: properties,
        options: scanOptions,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key":
            "sk-eyJrZXkiOiIyNzY3ZmUxOGZmOWYwMDc4MWQ3YzJiZDkiLCJuYW1lIjoiRGVmYXVsdCBBUEkgS2V5IGF1dG9nZW5lcmF0ZWQgdm13YiIsIm9yZ2FuaXphdGlvbklkIjoicHJlaWNvLWp1cmlkaWNvcy1mZXkzIn0_",
        },
      }
    );

    const scanData = scanResult.data.data;
    // console.log("Datos escaneados:", scanData);
    return scanData; // Devuelve los datos obtenidos del escaneo
  } catch (error) {
    console.error("Error al escanear el documento:", error);
    throw error;
  }
};
