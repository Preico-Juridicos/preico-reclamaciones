import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Card, Button, Title, Paragraph, Avatar } from "react-native-paper";
import Descubierto from "./descubierto/Descubierto";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";

// Images
import claimsDescubierto from "../assets/images/claimsDescubierto.png";

const Stack = createStackNavigator();

const ClaimsList = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);
  
  const claims = [
    {
      id: "1",
      title: "Descubierto",
      description: "Reclamación por descubierto bancario",
      image: claimsDescubierto,
      component: "Descubierto",
    },
    // {
    //   id: "2",
    //   title: "Comisiones",
    //   description: "Reclamación por comisiones indebidas",
    // },
  ];
  //   https://pictogrammers.com/library/mdi/
  const LeftContent = (props) => (
    <Avatar.Icon {...props} icon="file-document-edit-outline" />
  );
  const renderCards = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.component)}>
      <Card style={styles.claimsCardContainer}>
        <Card.Title
          title={item.title}
          //   subtitle={item.title}
          left={LeftContent}
        />
        <Image source={item.image} style={styles.claimsCover} />
        <Card.Content>
          <Text variant="bodyMedium">{item.description}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={claims}
      renderItem={renderCards}
      keyExtractor={(item) => item.id}
      style={styles.claimsContainer}
    />
  );
};

// const styles = StyleSheet.create({
//   claimsItem: {
//     backgroundColor: "#f2e8cf",
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 20,
//   },
//   claimsTitle: {
//     fontSize: 28,
//   },
//   claimsContainer: {
//     alignContent: "center",
//     margin: 10,
//     maxWidth: 375,
//     // backgroundColor: "#f2e8cf",
//     flex: 1,
//   },
//   claimsCover: {
//     padding: 10,
//     width: "100%",
//     height: 150,
//     borderRadius: 0,
//     resizeMode: "cover",
//     marginBottom: 10,
//   },
// });

export default ClaimsList;
