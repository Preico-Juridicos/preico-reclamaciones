import axios from 'axios';

const apiKey = 'AIzaSyB9HqCFD8fuYjIhxvH2Pq0SYy44zPQeDx8';
const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

const getPostalCode = async (address) => {
    try {
        const response = await axios.get(baseUrl, {
            params: {
                address: address,
                key: apiKey
            }
        });
        
        if (response.data.status === "OK") {
            const components = response.data.results[0].address_components;
            const postalCode = components.find(comp => comp.types.includes("postal_code"));
            return postalCode ? postalCode.long_name : "Código postal no encontrado";
        } else {
            throw new Error("Error en la API: " + response.data.status);
        }
    } catch (error) {
        console.error("Error obteniendo el código postal:", error);
        throw error;
    }
};

export default getPostalCode;