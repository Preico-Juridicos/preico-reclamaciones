import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import CollapsibleView from "../CollapsibleView";
import { createStyles } from "../../constants/styles";

const StepSolicitarMovimientos = ({ navigation, currentStep, updateStep }) => {
  const styles = createStyles();

  useEffect(() => {
    if (currentStep !== 4) {
      updateStep(4);
    }
  }, [currentStep, updateStep]);

  const handleNextStep = () => {
    // updateStep(5);
    navigation.navigate("StepReclamacionAhora");
  };

  const handlePreviousStep = () => {
    // updateStep(3);
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Inicio" }],
    });
  };
  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        ¿Quieres que preparemos un formulario para pedir los movimientos de tu cuenta bancaria?
      </Text>
      <Text style={styles.collapsibleContentText}>
        Despliega una de las opciones.
      </Text>
      <View style={{ gap: 10, marginTop: 10 }}>
        <CollapsibleView title="SOLICITALO TU MISMO">
          <Text style={styles.collapsibleContentText}>
            Solicita personalmente los movimientos de tu cuenta.
          </Text>
          <View>
            <Text style={styles.collapsibleContentText}>
              WEB: Introduce tu identificador y contraseña. Ve a Cuentas y Mis
              Cuentas, selecciona el IBAN de tu cuenta o cuentas, allí
              selecciona Movimientos y especifica el rango de fechas a
              consultar. Encontrarás un buscador que agrupará todos aquellos
              movimientos que contengan el mismo Concepto. Puedes probar con:
              comisión descubierto, comisión saldo deudor, comisión por posición
              deudora. Una vez dispongas de los movimientos en pantalla podrás
              guardarlos en formato PDF, EXCEL o NORMA 43 en tu ordenador.
            </Text>
            <Text style={styles.collapsibleContentText}>
              APP: El método es idéntico al anterior. Sin embargo, la obtención
              de los movimientos en PDF o EXCEL puede ser algo compleja.
            </Text>
            <Text style={styles.collapsibleContentText}>
              RECLAMACIÓN ANTE EL BANCO: Puedes enviar una reclamación a tu
              banco pidiendo los movimientos de los últimos 5 años. En el
              documento debe constar tu nombre y apellidos, haz constar tu nº de
              cuenta, la fecha y tu firma. Debes disponer de dos copias: una
              para el banco y otra para ti que te deberán sellar en tu oficina.
            </Text>
            <View style={styles.formNavigationButtonsContainer}>
              <PrimaryButton onPress={handleNextStep} title="Ya los tengo!" />
              <SecondaryButton
                onPress={handleGoHome}
                title="Los tengo que pedir"
              />
            </View>
          </View>
        </CollapsibleView>
        <CollapsibleView title="PREICO TE AYUDA">
          <Text style={styles.collapsibleContentText}>
            Te ayudaremos a enviar la reclamación a tu banco, basada en la
            normativa del Banco de España. Recuerda, no deben cobrarte por estos
            documentos, aunque algunos bancos lo intentan. Si esto ocurre,
            avísanos para ayudarte. Una vez los recibas, vuelve y seguimos con
            el proceso.
          </Text>
          <View style={{ gap: 10 }}>
            <PrimaryButton onPress={handleNextStep} title="Seguimos" />
          </View>
        </CollapsibleView>
      </View>
      <View style={{ marginTop: 10 }}>
        <SecondaryButton title="Atrás" onPress={handlePreviousStep} />
      </View>
    </ScrollView>
  );
};

export default StepSolicitarMovimientos;
