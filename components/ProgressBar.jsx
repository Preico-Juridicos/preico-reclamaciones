import React from "react";
import { View, } from "react-native";
import * as Progress from "react-native-progress";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";


const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep - 1) / (totalSteps - 1); // Progreso entre 0 y 1
  
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.barContainer}>
      <Progress.Bar
        progress={progress}
        width={null}
        color={styles.cardText.color}
        unfilledColor={styles.card.backgroundColor}
        borderWidth={0}
        height={10}
      />
    </View>
  );
};


export default ProgressBar;
