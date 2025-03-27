import axios from "axios";

// Endpoint de la API de Firmafy
const FIRMAFY_ENDPOINT =
  "https://app.firmafy.com/ApplicationProgrammingInterface.php";

// ID del entorno visual en Firmafy
const id_show = "9044e9cdbe37563f523ca62a59d6e0aa";

/**
 * Método genérico para realizar solicitudes a la API de Firmafy.
 * @param {string} action - La acción a realizar en la API.
 * @param {Object} data - Los datos adicionales requeridos por la acción.
 * @returns {Promise<Object>} - La respuesta de la API de Firmafy.
 */
const makeFirmafyRequest = async (action, data = {}) => {
  try {
    // Añadimos la acción al objeto data
    const params = {
      action,
      ...data,
    };

    // Realizamos la solicitud POST a la API de Firmafy
    const response = await axios.post(FIRMAFY_ENDPOINT, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Retornamos la respuesta de la API
    return response.data;
  } catch (error) {
    // Manejo de errores
    console.error(
      "Error al realizar la solicitud a Firmafy:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Función para obtener el token de autenticación mediante login.
 * @param {string} usuario - El nombre de usuario de Firmafy.
 * @param {string} password - La contraseña de Firmafy.
 * @returns {Promise<string>} - El token de autenticación.
 */
const obtenerToken = async (usuario, password) => {
  try {
    const data = {
      usuario,
      password,
    };

    const response = await makeFirmafyRequest("login", data);

    if (!response.error) {
      return response.data;
    } else {
      throw new Error("Error en la autenticación: " + response.data);
    }
  } catch (error) {
    console.error("Error al obtener el token:", error.message);
    throw error;
  }
};

/**
 * Función para realizar la solicitud de firma.
 * @param {string} token - El token de autenticación obtenido previamente.
 * @param {Array<Object>} signer - Array de firmantes en formato JSON.
 * @param {Object} pdfOptions - Opciones para el envío del PDF (puede ser archivo, base64 o URL).
 * @param {Object} [options] - Opciones adicionales (opcional).
 * @returns {Promise<Object>} - La respuesta de la API de Firmafy.
 */
const solicitarFirma = async (token, signer, pdfOptions, options = {}) => {
  try {
    // Construimos los datos necesarios para la solicitud de firma
    const data = {
      token,
      id_show,
      signer: JSON.stringify(signer), // Convertimos el array de firmantes a string JSON
      ...options,
    };

    data.pdf_url = pdfOptions.pdfFile.uri;
    data.pdf_name = pdfOptions.pdfFile.name;

    const response = await makeFirmafyRequest("request", data);

    if (response.error === false) {
      return response.message;
    } else {
      throw new Error("Error en la solicitud de firma: " + response.message);
    }
  } catch (error) {
    console.error("Error al solicitar la firma:", error.message);
    throw error;
  }
};

/**
 * Función para suscribirse a eventos de Webhook en Firmafy.
 * @param {string} token - Token de sesión obtenido tras login.
 * @param {number} type - Tipo de evento (1, 2 o 5).
 * @param {number} method - Método de envío (1 para Array POST, 2 para JSON).
 * @param {string} url_webhook - URL donde Firmafy enviará la notificación.
 * @returns {Promise<Object>} - La respuesta de la API de Firmafy.
 */
const suscribirseWebhook = async (token, type, method, url_webhook) => {
  try {
    const data = {
      token,
      id_show,
      type,
      method,
      url_webhook,
    };

    const response = await makeFirmafyRequest("webhook", data);

    if (!response.error) {
      return response.message;
    } else {
      throw new Error("Error en la suscripción al webhook: " + response.message);
    }
  } catch (error) {
    console.error("Error al suscribirse al webhook:", error.message);
    throw error;
  }
};

// Exportamos las funciones para que puedan usarse en otros módulos
export { makeFirmafyRequest, obtenerToken, solicitarFirma, suscribirseWebhook };
