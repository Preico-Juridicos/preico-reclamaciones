import { obtenerToken, solicitarFirma } from "./firmaFyService";

// Función para iniciar el proceso de solicitud de firma
export const enviarSolicitudDeFirma = async (
  fileName,
  fileURL,
  { nombre, dni, email, cargo, telefono }
) => {
  try {
    // OLD
    // const usuario = "documentacion@preicojuridicos.com";
    // const password = "12X7y!B26o#Z";

    const usuario = "app@preicojuridicos.com";
    const password = "2E2uuF1#$9^J";

    // Obtener el token de autenticación
    const token = await obtenerToken(usuario, password);

    // Definir los firmantes
    const signer = [
      {
        nombre: nombre,
        nif: dni,
        cargo: cargo,
        email: email,
        telefono: telefono,
        type_notifications: "email",
      },
      //   {
      //     nombre: "Fran Cortes",
      //     nif: "98765432B",
      //     cargo: "Responsable",
      //     email: "hola@firmafy.com",
      //     telefono: 777777777,
      //     empresa: "FIRMAFY",
      //     cif: "B11111111",
      //     type_notifications: "email", //"email,sms",
      //   },
    ];

    // Opciones para el PDF (ejemplo enviando un archivo)
    const pdfOptions = {
      pdfFile: {
        uri: fileURL,
        type: "application/pdf",
        name: fileName,
      },
    };

    // Opciones adicionales (opcional)
    const options = {
      //   document_lang: 'CA', // Idioma de notificación
      // Otros parámetros opcionales como 'coordenadas', 'subject', 'message', etc.
    };

    // Realizar la solicitud de firma
    const respuesta = await solicitarFirma(token, signer, pdfOptions, options);

    console.log("Solicitud de firma realizada con éxito:", respuesta);
    return { success: true };
  } catch (error) {
    console.error("Error al enviar la solicitud de firma:", error.message);
    return { success: false, error: error.message };
  }
};

// enviarSolicitudDeFirma();
