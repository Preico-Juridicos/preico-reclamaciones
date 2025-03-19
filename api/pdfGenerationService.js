import axios from "axios";

const API_URL = "https://api.totalum.app/api/v1/pdf-template/generatePdfByTemplate/674f1c673827c540c7737646";
const API_KEY = "sk-eyJrZXkiOiIyNzY3ZmUxOGZmOWYwMDc4MWQ3YzJiZDkiLCJuYW1lIjoiRGVmYXVsdCBBUEkgS2V5IGF1dG9nZW5lcmF0ZWQgdm13YiIsIm9yZ2FuaXphdGlvbklkIjoicHJlaWNvLWp1cmlkaWNvcy1mZXkzIn0_";

export async function generatePR({ claimCode, pdfData }) {
  try {
    // const variablesExample = {
    //   claimCode,
    //   date: new Date().toISOString(),
    // };
    const fileName = `${claimCode}_documento.pdf`;

    const response = await axios.post(
      API_URL,
      {
        variables: pdfData,
        name: fileName,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
      }
    );

    return {
      success: true,
      fileUrl: response.data.data.url,
      fileName: response.data.data.fileName,
    };
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    return { success: false, error };
  }
}