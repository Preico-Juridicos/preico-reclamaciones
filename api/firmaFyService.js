// firmaFyService.js

import axios from "axios";

const FIRMAFY_ENDPOINT =
  "https://app.firmafy.com/ApplicationProgrammingInterface.php";
const id_show = "9044e9cdbe37563f523ca62a59d6e0aa";

/**
 * Método genérico para realizar solicitudes a la API de Firmafy.
 * @param {string} action - La acción a realizar en la API.
 * @param {Object} data - Los datos adicionales requeridos por la acción.
 * @returns {Promise<Object>} - La respuesta de la API de Firmafy.
 */
const makeFirmafyRequest = async (action, data = {}) => {
  try {
    // Añadimos el action al objeto data
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
      // Retornamos el token obtenido
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
    // Construimos los datos para la solicitud
    const data = {
      token,
      id_show,
      signer: JSON.stringify(signer),
      ...options,
    };

    // Determinamos cómo se enviará el PDF
    let files = {};
    if (pdfOptions.pdfFile) {
      // Enviamos el PDF como archivo
      files.pdf = pdfOptions.pdfFile;
    } else if (pdfOptions.pdf_base64) {
      // Enviamos el PDF en base64
      data.pdf_base64 = pdfOptions.pdf_base64;
      data.pdf_name = pdfOptions.pdf_name;
    } else if (pdfOptions.pdf_url) {
      // Enviamos el PDF mediante una URL pública
      data.pdf_url = pdfOptions.pdf_url;
      data.pdf_name = pdfOptions.pdf_name;
    } else {
      throw new Error("Debe proporcionar un PDF para la solicitud de firma.");
    }

    const response = await makeFirmafyRequest("request", data, files);

    if (!response.error) {
      console.log("Solicitud de firma enviada correctamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error en la solicitud de firma: " + response.data);
    }
  } catch (error) {
    console.error("Error al solicitar la firma:", error.message);
    throw error;
  }
};

export { makeFirmafyRequest, obtenerToken, solicitarFirma };
