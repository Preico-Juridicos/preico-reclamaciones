import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Descubierto from "./descubierto/Descubierto";

const DynamicPageRenderer = ({ claimId }: { claimId: string }) => {
  switch (claimId) {
    case "descubierto":
      return (
        <View style={styles.pageContainer}>
          {/* <Text style={styles.pageTitle}>Página Descubierto</Text>
          <Text>Contenido específico para "descubierto".</Text> */}
          <Descubierto />
        </View>
      );

    case "otro":
      return (
        <View style={styles.pageContainer}>
          <Text style={styles.pageTitle}>Página Otro</Text>
          <Text>Contenido específico para "otro".</Text>
        </View>
      );

    default:
      return (
        <View style={styles.pageContainer}>
          <Text style={styles.pageTitle}>
            Este tipo de Reclamación aun se esta preparando
          </Text>
          <Text>Contenido no definido para este tipo de reclamación.</Text>
        </View>
      );
  }
};

export default DynamicPageRenderer;

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
