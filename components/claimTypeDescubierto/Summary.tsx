import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore"; // Importaciones necesarias
import { useRoute } from "@react-navigation/native"; // Hook para acceder a route params
import { firestore, getCurrentUserId } from "@/firebase.config";
import { PrimaryButton, SecondaryButton } from "../Buttons";

type StepComponentProps = {
  stepId: string;
  data: Record<string, any>;
  updateData: (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean
  ) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
};

const Summary: React.FC<StepComponentProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
}) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute(); // Acceso a los parámetros de la navegación
  const claimId = route.params?.claimId || null;

  const db = getFirestore(); // Inicializar Firestore

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (claimId) {
          // Si existe claimId, obtenemos los datos desde Firestore
          const docRef = doc(
            db,
            `usuarios/${getCurrentUserId()}/reclamaciones`,
            claimId
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data()); // Setear los datos obtenidos en el estado
            // updateStep(6); // Actualizar el paso (si es necesario)
          } else {
            console.log("No se encontró el documento");
          }
        } else {
          // Si no hay claimId, intenta obtener los datos de AsyncStorage
          const data = await AsyncStorage.getItem("formData");
          if (data !== null) {
            setFormData(JSON.parse(data));
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [claimId]);

  const saveToFirestore = async (data) => {
    try {
      const userId = data.userId; // Asegúrate de que userId está en los datos
      const docRef = await addDoc(
        collection(firestore, `usuarios/${userId}/reclamaciones`),
        {
          tipo: "descubierto",
          fecha_reclamacion: new Date(),
          ...data,
        }
      );
      console.log("Documento escrito con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al guardar en Firestore: ", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setLoading(true);

      // 1. Guardar los datos en Firestore
      if (!claimId) await saveToFirestore(formData);
      const today = new Date();
      // 2. Generar el PDF
      // const htmlContent2 = `
      //   <h1>Resumen del Formulario</h1>
      //   <p><strong>Entidad Bancaria:</strong> ${formData.entidadBancaria}</p>
      //   <p><strong>Número de Cuenta:</strong> ${formData.numeroCuenta}</p>
      //   <h2>Comisiones</h2>
      //   <table border="1" style="width:100%; border-collapse: collapse;">
      //     <tr>
      //       <th>Fecha</th>
      //       <th>Importe (€)</th>
      //     </tr>
      //     ${formData.comisiones
      //       .map(
      //         (com) => `<tr><td>${com.fecha}</td><td>${com.importe}</td></tr>`
      //       )
      //       .join("")}
      //   </table>
      //   <p><strong>Total Importes:</strong> ${formData.comisiones
      //     .reduce((acc, curr) => acc + parseFloat(curr.importe || 0), 0)
      //     .toFixed(2)} €</p>
      //   <p><strong>Nombre Completo:</strong> ${formData.nombreCompleto}</p>
      //   <p><strong>DNI:</strong> ${formData.dni}</p>
      //   <p><strong>Dirección:</strong> ${formData.direccion}, ${formData.localidad}, ${formData.provincia}</p>
      // `;
      const htmlContent = `
        <div style="margin: 100px;font-family: monospace, monospace;">
            <h1 style="text-align: center;">ESCRITO DE RECLAMACIÓN DE COMISIÓN POR DESCUBIERTO<br /><u><b>PREICO JURIDICOS</u></b></h1>
            <div style="margin: 50px 0;">
                <p>
                    Yo, <u>${formData.nombreCompleto}</u> con DNI <u>${
        formData.dni
      }</u> Con
                    dirección de vivienda en <u>${formData.address}</u>.
                </p>
            </div>
            <div>
                <p>
                    Hoy día ${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}
                    presento este escrito para formular la RECLAMACIÓN fehaciente en los
                    términos previstos en la Ley General de Consumidores y Usuarios, en base a
                    los siguientes;
                </p>
                <ol>
                    <li>
                    ¿Qué entidad Bancaria te ha cobrado las comisiones?
                    <p>
                        <b>${formData.entidadBancaria}</b>
                    </p>
                    </li>

                    <li>Número de cuenta Bancaria:
                    <p>
                        <b>${formData.numeroCuenta}</b>
                    </p>
                    </li>
                    <li>
                    ¿En qué fechas ha venido cargando la entidad financiera las comisiones
                    en tu cuenta bancaria?
                    <p>
                    ${formData.comisiones
                      .map(
                        (com) => `
                    ${com.fecha} importe de: ${com.importe} €<br />
                    `
                      )
                      .join("")}
                    <p>
                        <b>
                            Resultando un importe total de: ${formData.comisiones
                              .reduce(
                                (acc, curr) =>
                                  acc + parseFloat(curr.importe || 0),
                                0
                              )
                              .toFixed(2)}
                            €
                        </b>
                    </p>
                    </li>
                </ol>
            </div>
            <div>
            <p></p><b>SEGUNDO.-</b>
            
                El cobro de los importes citados es CONTRARIA A LA ORDEN MINISTERIAL
                EHA/2899/2011, de 28 OCTUBRE, y a la posición del Banco de España.
            </p>
            <p>
                La orden ministerial EHA/2899/2011, de 28 de OCTUBRE, de transparencia y
                protección del cliente de servicios bancarios, concretamente al artículo
                3, establece que “ Sólo podrán percibirse comisiones o repercutirse
                gastos por servicios solicitados en firme o aceptados expresamente por
                un cliente y siempre que respondan a servicios efectivamente prestados o
                gastos habidos”.
            </p>
            </div>
            <div>
            <p></p><b>TERCERO.-</b>
            
                El servicio de Reclamaciones del Banco España recoge este criterio en su
                memoria del servicio de reclamaciones: Es criterio del servicio de
                Reclamaciones del Banco de España que el adeudo de esta comisión sólo
                puede ser posible si, además de aparecer recogida en el contrato, se
                acredita que:
            </p>
            <ul>
                <li>
                Su devengo está vinculado a la existencia efectiva de gestiones de
                reclamación realizadas ante el cliente deudor (algo que, a juicio de
                este servicio, no está justificado con la simple remisión de una carta
                periódicamente generada por el ordenador).
                </li>
                <li>
                Es la única en la reclamación de un mismo saldo. No obstante, se
                considera que su adeudo es compatible con la repercusión de gastos
                soportados por la entidad como consecuencia, en su caso, de la
                intervención de terceros en las gestiones de reclamación (por ejemplo,
                Notaria)
                </li>
                <li>
                Dada su naturaleza, su cuantía es única, cualquiera que sea el importe
                del saldo reclamado, no admitiéndose, por tanto, tarifas porcentuales.
                </li>
            </ul>
            </div>
            <div>
            <p></p><b>CUARTO.-</b>
                Además, y como criterio adicional, se considera que la aplicación
                automática de dicha comisión no constituye una buena práctica bancaria,
                ya que la reclamación debe realizarse teniendo en cuenta las
                circunstancias particulares de cada impagado y de cada cliente. En
                efecto, solo cuando se analiza, caso por caso, la procedencia de llevar
                a cabo cada reclamación, se justifica, bajo el principal de la buena fe,
                la realización de gestiones individualizadas de recuperación.
            </p>
            </div>
            <div>
                <p></p><b>QUINTO.-</b>
                Según la sentencia del Tribunal Supremo nº 566/19, de 25 de octubre,
                señala que:
                </p>
                <p>
                    "No se cumple las exigencias del Banco de España para este tipo de
                    comisiones, porque prevé que podrá reiterarse y se plantea como una
                    reclamación automática. Tampoco discrimina periodos de mora, de modo
                    que basta la inefectividad de la cuota en la fecha de pago prevista
                    para que, además de los intereses moratorios, se produzca el devengo
                    de la comisión."
                </p>
                <p>
                "Además, una clausula como la enjuiciada contiene una alteración de la
                carga de la prueba en perjuicio del consumidor, pues debería ser el
                Banco quien probara la realidad de la gestión y su precio, pero, con la
                clausula, se traslada al consumidor la obligación de probar o que no
                haya habido gestión. Lo que también podría incurrir en la prohibición
                prevista en el art. 88.2 TRLGCU."
                </p>
            </div>
            <div>
            <p></p><b>SEXTO.-</b>
                La memoria del servicio de Reclamaciones del Banco de España a este
                respecto es accesible en el siguiente enlace, que recoge los criterios
                Específicos de buenas Prácticas Bancarias del Banco de España:
            </p>
            <p>
                <a
                href="https://www.bde.es/f/webbde/Secciones/Publicaciones/PublicacionesAnuales/MemoriaServicioReclamaciones/10/buenas_practicas.pdf"
                >
                https://www.bde.es/f/webbde/Secciones/Publicaciones/PublicacionesAnuales/MemoriaServicioReclamaciones/10/buenas_practicas.pdf</a
                >
            </p>
            </div>
            <div>
            <b><p>Por todo ello SOLICITO:</p>
            <ul>
                <li>
                Que me sea devuelta en la cuenta señalada y con carácter inmediato las
                cantidades cobradas en concepto de comisión por descubierto, por ser
                contraria a la posición del Banco de España, como ha quedado
                debidamente acreditado, y a la Orden Ministerial referida; y o sea aplicada en el futuro ninguna otra comisión por este concepto.
                </li>
            </ul>
            </b> 
            </div>
            <div>
            <p>
                Sin otro particular, confiando en no verme obligado a considerar otras
                acciones y esperando a que acceda a mis peticiones, en un plazo NO
                SUPERIOR A 20 DÍAS.
            </p>
            <p>Atentamente;</p>
             ${formData.nombreCompleto}<br/>${formData.dni}
            </div>
        </div>
    </div>
        `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // 3. Compartir el PDF
      await Sharing.shareAsync(uri);

      // 4. Limpiar el AsyncStorage si es necesario
      await AsyncStorage.removeItem("formData");

      Alert.alert("Éxito", "Formulario enviado correctamente.");
      //   navigation.navigate("StepBanco");
      navigation.navigate("Inicio");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Alert.alert("Error", "Hubo un problema al enviar el formulario.");
    } finally {
      setLoading(false);
      //   navigation.navigate("Inicio");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!formData) {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          No se encontraron datos del formulario.
        </Text>
        <PrimaryButton
          title="Volver al Inicio"
          onPress={() => navigation.navigate("StepBanco")}
        />
      </View>
    );
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Información de la Reclamación</Text>
      <Text style={styles.label}>Entidad Bancaria:</Text>
      <Text style={styles.value}>{formData.entidadBancaria}</Text>
      <Text style={styles.label}>Número de Cuenta:</Text>
      <Text style={styles.value}>{formData.numeroCuenta}</Text>
      <Text style={styles.label}>Comisiones:</Text>
      {formData.comisiones.map((com, index) => (
        <Text key={index} style={styles.value}>
          {com.fecha}: {com.importe} €
        </Text>
      ))}

      <Text style={styles.label}>
        Total Importes:{" "}
        {formData.comisiones
          .reduce((acc, curr) => acc + parseFloat(curr.importe || 0), 0)
          .toFixed(2)}{" "}
        €
      </Text>

      <Text style={styles.label}>Nombre Completo:</Text>
      <Text style={styles.value}>{formData.nombreCompleto}</Text>

      <Text style={styles.label}>DNI:</Text>
      <Text style={styles.value}>{formData.dni}</Text>

      <Text style={styles.label}>Dirección:</Text>
      <Text style={styles.value}>{formData.address}</Text>

      <PrimaryButton title="Generar Documento" onPress={handleSubmit} />
      <View style={{ marginTop: 10 }}>
        <SecondaryButton title="Atrás" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  formContainer: {
    flex: 1,
    backgroundColor: "#f2e8cf",
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2e8cf",
  },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  label: { fontWeight: "bold", marginTop: 10 },
  value: { marginLeft: 10, marginBottom: 5 },
});

export default Summary;
