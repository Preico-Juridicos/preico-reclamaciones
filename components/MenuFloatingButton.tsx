import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DrawerActions,
  useNavigation,
} from "@react-navigation/native";

import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

type MenuFloatingButtonProps = {
  style?: ViewStyle;
};

const MenuFloatingButton: React.FC<MenuFloatingButtonProps> = ({ style }) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;
  const [menuIcon, setMenuIcon] = useState<"menu" | "menu-open">("menu");

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const doAction = () => {
    if (menuIcon === "menu") {
      openDrawer();
    } else {
      closeDrawer();
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      const state = navigation.getState();
      const isDrawerOpen =
        state?.history?.some((entry) => entry.type === "drawer") ?? false;

      setMenuIcon(isDrawerOpen ? "menu-open" : "menu");
      Animated.timing(translateX, {
        toValue: isDrawerOpen ? 300 : 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });

    return unsubscribe;
  }, [navigation, translateX]);

  return (
    <View style={[styles.floatingButtonContainer, style]}>
      <TouchableWithoutFeedback onPress={doAction}>
        <Animated.View
          style={[
            styles.floatingButton,
            styles.floatingButtonMenu,
            { transform: [{ translateX }] },
          ]}
        >
          <MaterialIcons name={menuIcon} size={24} color={styles.drawerItemText.color} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default MenuFloatingButton;
