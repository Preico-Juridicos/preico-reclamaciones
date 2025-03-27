import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ClaimTypeTwoStepTwo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Paso 2 para Claim Type Two</Text>
    </View>
  );
};

export default ClaimTypeTwoStepTwo;

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
