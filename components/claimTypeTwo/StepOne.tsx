import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ClaimTypeTwoStepOne = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Paso 1 para Claim Type Two</Text>
    </View>
  );
};

export default ClaimTypeTwoStepOne;

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
