import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ClaimTypeOneStepOne = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Paso 1 para Claim Type One</Text>
    </View>
  );
};

export default ClaimTypeOneStepOne;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
