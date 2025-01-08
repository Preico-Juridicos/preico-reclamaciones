import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import createStyles from "@/assets/styles/themeStyles";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import MenuFloatingButton from "@/components/MenuFloatingButton";

function LayoutContent() {
  const { isDarkMode } = useTheme();
  const style = createStyles(isDarkMode);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: style.drawerContainer.backgroundColor,
          width: 330,
          borderRightWidth: 2,
          borderRightColor: style.drawerItemActive.backgroundColor,
        },
        drawerItemStyle: {
          borderRadius: 0,
          width: 330,
          marginLeft: -10,
        },
        drawerActiveBackgroundColor: style.drawerItemActive.backgroundColor,
        drawerActiveTintColor: style.drawerItemActiveText.color,
        drawerInactiveTintColor: style.drawerItemText.color,
        headerStyle: {
          backgroundColor: style.drawerContainer.backgroundColor,
        },
        headerTitleStyle: {
          color: style.drawerItemText.color,
          fontWeight: "bold",
        },
        drawerContentStyle: {
          backgroundColor: style.drawerContainer.backgroundColor,
        },
        drawerContentContainerStyle: {
          backgroundColor: style.drawerContainer.backgroundColor,
        },
        overlayColor: "transparent",
        drawerHideStatusBarOnOpen: false,
        swipeEdgeWidth: 100,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      detachInactiveScreens={true}
    >
      {/* Paginas visibles */}
      <Drawer.Screen
        name="home"
        options={{
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons
              name="home"
              color={
                focused
                  ? style.drawerItemActiveText.color
                  : style.drawerItemText.color
              }
              size={size}
            />
          ),
          drawerLabel: "Inicio",
          title: "",
        }}
      />
      <Drawer.Screen
        name="claims"
        options={{
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons
              name="view-comfy-alt"
              color={
                focused
                  ? style.drawerItemActiveText.color
                  : style.drawerItemText.color
              }
              size={size}
            />
          ),
          drawerLabel: "Todas las reclamaciones",
          title: "",
        }}
      />
      <Drawer.Screen
        name="my-claims"
        options={{
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons
              name="library-books"
              color={
                focused
                  ? style.drawerItemActiveText.color
                  : style.drawerItemText.color
              }
              size={size}
            />
          ),
          drawerLabel: "Mis reclamaciones",
          title: "",
        }}
      />

      {/* Paginas ocultas */}
      <Drawer.Screen
        name="auth/initial"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="user/[id]"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="user/gdpr"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="auth/login"
        options={{
          title: "Login",
          drawerLabel: "Logiin",

          drawerItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="auth/register"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
    </Drawer>
  );
}

export default function _layout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LayoutContent />
        <MenuFloatingButton />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
