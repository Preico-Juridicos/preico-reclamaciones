import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyClaims from "./MyClaims";
import Summary from "./descubierto/Summary";
import Descubierto from "./descubierto/Descubierto";

const Stack = createStackNavigator();

const ClaimsStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyClaims"
        component={MyClaims}
      />
      <Stack.Screen
        name="DescubiertoSummary"
        component={Descubierto}
      />
    </Stack.Navigator>
  );
};

export default ClaimsStack;
