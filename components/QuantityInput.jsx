import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

const QuantityInput = ({
  min = 0,
  max = 100,
  value = 0,
  onChangeText,
  onIncrease,
  onDecrease,
  ...inputProps
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [quantity, setQuantity] = useState(value);

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = parseInt(quantity) + 1;
      setQuantity(newQuantity);
      onIncrease && onIncrease(newQuantity);
      onChangeText && onChangeText(newQuantity.toString());
    }
  };

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = parseInt(quantity) - 1;
      setQuantity(newQuantity);
      onDecrease && onDecrease(newQuantity);
      onChangeText && onChangeText(newQuantity.toString());
    }
  };

  const handleChangeText = (text) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
      setQuantity(numericValue);
      onChangeText && onChangeText(text);
    }
  };

  return (
    <View style={InputStyles.container}>
      <TouchableOpacity
        style={[InputStyles.button, InputStyles.leftButton]}
        onPress={handleDecrease}
        disabled={quantity <= min}
      >
        <Text style={InputStyles.buttonText}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={InputStyles.input}
        keyboardType="numeric"
        value={quantity.toString()}
        onChangeText={handleChangeText}
        {...inputProps}
      />
      <TouchableOpacity
        style={[InputStyles.button, InputStyles.rightButton]}
        onPress={handleIncrease}
        disabled={quantity >= max}
      >
        <Text style={InputStyles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const InputStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    width: 100,
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#e2d3b6", // cambiar por theme.backgroundColorHighlight
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
  },
  buttonText: {
    color: "#fff", // cambiar por theme.text
    fontSize: 26,
  },
  leftButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default QuantityInput;
