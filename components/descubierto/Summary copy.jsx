// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';


// import { firestore } from "../../constants/firebaseConfig";
// import { collection, addDoc } from "firebase/firestore"; 
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage

// const Summary = ({ navigation, updateStep }) => {
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await AsyncStorage.getItem('formData');
//         if (data !== null) {
//           setFormData(JSON.parse(data));
//           updateStep(6);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       // 1. Enviar datos a la base de datos
//       // Implementa aquí la lógica para enviar los datos a tu backend
//       // Por ejemplo:
//       /*
//       const response = await fetch('https://tu-api.com/endpoint', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const result = await response.json();
//       */

//       // 2. Generar el PDF
//       const htmlContent = `
//         <h1>Resumen del Formulario</h1>
//         <p><strong>Entidad Bancaria:</strong> ${formData.entidadBancaria}</p>
//         <p><strong>Número de Cuenta:</strong> ${formData.numeroCuenta}</p>
//         <h2>Comisiones</h2>
//         <table border="1" style="width:100%; border-collapse: collapse;">
//           <tr>
//             <th>Fecha</th>
//             <th>Importe (€)</th>
//           </tr>
//           ${formData.comisiones
//             .map((com) => `<tr><td>${com.fecha}</td><td>${com.importe}</td></tr>`)
//             .join('')}
//         </table>
//         <p><strong>Total Importes:</strong> ${formData.comisiones
//           .reduce((acc, curr) => acc + parseFloat(curr.importe || 0), 0)
//           .toFixed(2)} €</p>
//         <p><strong>Nombre Completo:</strong> ${formData.nombreCompleto}</p>
//         <p><strong>DNI:</strong> ${formData.dni}</p>
//         <p><strong>Dirección:</strong> ${formData.direccion}, ${formData.localidad}, ${formData.provincia}</p>
//       `;

//       const { uri } = await Print.printToFileAsync({ html: htmlContent });

//       // 3. Compartir el PDF
//       await Sharing.shareAsync(uri);

//       // 4. Limpiar AsyncStorage si es necesario
//       await AsyncStorage.removeItem('formData');

//       Alert.alert('Éxito', 'Formulario enviado y PDF generado correctamente.');
//       navigation.navigate('StepBanco');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Hubo un problema al enviar el formulario.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   if (!formData) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>No se encontraron datos del formulario.</Text>
//         <Button title="Volver al Inicio" onPress={() => navigation.navigate('StepBanco')} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Resumen del Formulario</Text>
//       {/* Opcional: Mostrar un resumen de los datos */}
//       <Text style={styles.label}>Entidad Bancaria:</Text>
//       <Text style={styles.value}>{formData.entidadBancaria}</Text>

//       <Text style={styles.label}>Número de Cuenta:</Text>
//       <Text style={styles.value}>{formData.numeroCuenta}</Text>

//       <Text style={styles.label}>Comisiones:</Text>
//       {formData.comisiones.map((com, index) => (
//         <Text key={index} style={styles.value}>
//           {com.fecha}: {com.importe} €
//         </Text>
//       ))}

//       <Text style={styles.label}>
//         Total Importes: {formData.comisiones.reduce((acc, curr) => acc + parseFloat(curr.importe || 0), 0).toFixed(2)} €
//       </Text>

//       <Text style={styles.label}>Nombre Completo:</Text>
//       <Text style={styles.value}>{formData.nombreCompleto}</Text>

//       <Text style={styles.label}>DNI:</Text>
//       <Text style={styles.value}>{formData.dni}</Text>

//       <Text style={styles.label}>Dirección:</Text>
//       <Text style={styles.value}>
//         {formData.direccion}, {formData.localidad}, {formData.provincia}
//       </Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#4CAF50" />
//       ) : (
//         <>
//           <Button title="Enviar Formulario" onPress={handleSubmit} />
//           <View style={{ marginTop: 10 }}>
//             <Button title="Atrás" onPress={() => navigation.goBack()} />
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
//   label: { fontWeight: 'bold', marginTop: 10 },
//   value: { marginLeft: 10, marginBottom: 5 },
// });

// export default Summary;
