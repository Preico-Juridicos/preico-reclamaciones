import React from "react";
import { Text, Pressable } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

const PrimaryButton = (props) => {
  const {
    onPress,
    title = "",
    btnStyle = {},
    textStyle = {},
    disabled = false,
  } = props;
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  return (
    <Pressable
      style={[
        styles.buttonPrimary,
        btnStyle,
        disabled && styles.buttonDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
    >
      <Text
        style={[
          styles.buttonTextPrimary,
          textStyle,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const SecondaryButton = (props) => {
  const {
    onPress,
    title = "",
    btnStyle = {},
    textStyle = {},
    disabled = false,
  } = props;
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  return (
    <Pressable
      style={[
        styles.buttonSecondary,
        btnStyle,
        disabled && styles.buttonDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
    >
      <Text
        style={[
          styles.buttonTextSecondary,
          textStyle,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export { PrimaryButton, SecondaryButton };
