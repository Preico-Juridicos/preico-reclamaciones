import {
  obtenerToken,
  solicitarFirma,
  suscribirseWebhook,
} from "./firmaFyService";

// OLD
// const usuario = "documentacion@preicojuridicos.com";
// const password = "12X7y!B26o#Z";
const usuario = "app@preicojuridicos.com";
const password = "2E2uuF1#$9^J";

// Función para iniciar el proceso de solicitud de firma
export const enviarSolicitudDeFirma = async (
  fileName,
  fileURL,
  { nombre, dni, email, cargo, telefono }
) => {
  try {
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
    ];

    const pdfOptions = {
      pdfFile: {
        uri: fileURL,
        type: "application/pdf",
        name: fileName,
      },
    };

    // Realizar la solicitud de firma
    const respuesta = await solicitarFirma(token, signer, pdfOptions, {});

    console.log("Solicitud de firma realizada con éxito:", respuesta);
    return { success: true };
  } catch (error) {
    console.error("Error al enviar la solicitud de firma:", error.message);
    return { success: false, error: error.message };
  }
};

export const suscribirWebhook = async () => {
  try {
    // Obtener el token de autenticación
    const token = await obtenerToken(usuario, password);
    // Configura los parámetros del webhook
    const tipoEvento = 1; // Ej: Documento Firmado
    const metodoEnvio = 2; // JSON
    const urlWebhook = "...";

    const resultado = await suscribirseWebhook(
      token,
      tipoEvento,
      metodoEnvio,
      urlWebhook
    );
    console.log("Suscripción realizada con éxito:", resultado);
  } catch (error) {
    console.error("Error durante la prueba de suscripción:", error.message);
  }
};

// enviarSolicitudDeFirma();
