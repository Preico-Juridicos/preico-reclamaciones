import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback, Animated } from "react-native";
import { createStyles } from "../constants/styles";

const CollapsibleView = ({
  title,
  children,
  collapsibleContainerStyle,
  collapsibleHeaderStyle,
  collapsibleHeaderTextStyle,
  collapsibleContentStyle,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const animation = useState(new Animated.Value(0))[0];
  const styles = createStyles();

  const containerStyle = collapsibleContainerStyle || styles.collapsibleContainer;
  const headerStyle = collapsibleHeaderStyle || styles.collapsibleHeader;
  const headerTextStyle = collapsibleHeaderTextStyle || styles.collapsibleHeaderText;
  const contentStyle = collapsibleContentStyle || styles.collapsibleContent;

  const toggleCollapse = () => {
    Animated.timing(animation, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setCollapsed(!collapsed);
  };

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={containerStyle}>
      <TouchableWithoutFeedback onPress={toggleCollapse}>
        <View style={headerStyle}>
          <Text style={headerTextStyle}>{title} {collapsed ? "▼" : "▲"}</Text>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View
        style={{
          opacity: opacityInterpolate,
          height: collapsed ? 0 : "auto",
          overflow: "hidden",
        }}
      >
        <View style={contentStyle}>{children}</View>
      </Animated.View>
    </View>
  );
};

export default CollapsibleView;
