import { obtenerToken, solicitarFirma } from "./firmaFyService";

// Función para iniciar el proceso de solicitud de firma
const enviarSolicitudDeFirma = async () => {
  try {
    const usuario = "documentacion@preicojuridicos.com";
    const password = "12X7y!B26o#Z";

    // Obtener el token de autenticación
    const token = await obtenerToken(usuario, password);

    // Definir los firmantes
    const signer = [
      {
        nombre: "Wence Criado",
        nif: "12345678A",
        cargo: "Trabajador",
        email: "soporte@firmafy.com",
        telefono: 600000000,
        type_notifications: "email",
      },
      {
        nombre: "Fran Cortes",
        nif: "98765432B",
        cargo: "Responsable",
        email: "hola@firmafy.com",
        telefono: 777777777,
        empresa: "FIRMAFY",
        cif: "B11111111",
        type_notifications: "email,sms",
      },
    ];

    // Opciones para el PDF (ejemplo enviando un archivo)
    const pdfOptions = {
      pdfFile: {
        uri: "file:///ruta/al/archivo.pdf",
        type: "application/pdf",
        name: "documento.pdf",
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
  } catch (error) {
    console.error("Error al enviar la solicitud de firma:", error.message);
  }
};

enviarSolicitudDeFirma();
