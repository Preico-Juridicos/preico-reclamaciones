import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ScreenContentWrapper } from "react-native-screens";

// Colores para los temas
const colors = {
  light: {
    background: "#F1F0E8", // Fondo principal claro
    backgroundColorHighlight: "#E5E1DA", // Resaltado claro
    text: "#3C3D37", // Texto principal
    textHighlight: "#89A8B2", // Texto principal
    card: "#B3C8CF", // Fondo de tarjetas
    buttonPrimary: "#89A8B2", // Botón primario
    buttonSecondary: "#B3C8CF", // Botón secundario
    buttonTextPrimary: "#F1F0E8", // Texto botón primario
    buttonTextSecondary: "#3C3D37", // Texto botón secundario
    borderColor: "#E5E1DA", // Borde
    // headerBackground: "#E5E1DA", // Encabezado
    // drawerBackground: "#F1F0E8", // Fondo del Drawer
    // drawerItem: "#697565", // Texto de los elementos del Drawer
    // drawerItemActive: "#89A8B2", // Elemento activo del Drawer
    progress: "#4CAF50",
    unfilledProgress: "#e0e0e0",
  },
  dark: {
    background: "#1E201E", // Fondo principal oscuro
    backgroundColorHighlight: "#697565", // Resaltado oscuro
    text: "#ECDFCC", // Texto principal
    textHighlight: "#D3F1DF", // Texto principal
    card: "#697565", // Fondo de tarjetas
    buttonPrimary: "#ECDFCC", // Botón primario
    buttonSecondary: "#3C3D37", // Botón secundario
    buttonTextPrimary: "#1E201E", // Texto botón primario
    buttonTextSecondary: "#ECDFCC", // Texto botón secundario
    borderColor: "#697565", // Borde
    // headerBackground: "#1E201E", // Encabezado
    // drawerBackground: "#1E201E", // Fondo del Drawer
    // drawerItem: "#ECDFCC", // Texto de los elementos del Drawer
    // drawerItemActive: "#697565", // Elemento activo del Drawer
    progress: "#76FF03",
    unfilledProgress: "#666666",
  },
};

const createStyles = (isDarkMode = useTheme().isDarkMode) => {
  const theme = isDarkMode ? colors.dark : colors.light;

  return StyleSheet.create({
    background: { backgroundColor: theme.background },
    backgroundColorHighlight: {
      backgroundColor: theme.backgroundColorHighlight,
    },
    text: { color: theme.text },
    textHighlight: { color: theme.textHighlight },
    // Contenedor principal
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // Header
    header: {
      backgroundColor: theme.background,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomColor: theme.borderColor,
      borderBottomWidth: 1,
    },

    textPrimary: {
      color: theme.text,
      fontSize: 18,
    },

    textSecondary: {
      color: theme.backgroundColorHighlight,
      fontSize: 14,
    },

    headerLogo: {
      paddingLeft: 10,
      fontSize: 20,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: "#ECDFCC",
    },

    // Tarjeta
    card: {
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 10,
      borderColor: theme.borderColor,
      borderWidth: 1,
      elevation: 3,
    },
    cardText: {
      color: theme.text,
      fontSize: 16,
    },

    // Botones
    buttonPrimary: {
      backgroundColor: theme.buttonPrimary,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
    },

    buttonPrimaryText: {
      color: theme.buttonTextPrimary,
      textAlign: "center",
      fontWeight: "600",
    },

    buttonSecondary: {
      backgroundColor: theme.buttonSecondary,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
    },

    buttonSecondaryText: {
      color: theme.buttonTextSecondary,
      textAlign: "center",
      fontWeight: "400",
    },

    // Drawer Principal
    drawerContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },

    drawerItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginVertical: 4,
      borderRadius: 8,
    },

    drawerItemText: {
      fontSize: 16,
      color: theme.text,
    },

    drawerItemActive: {
      backgroundColor: theme.backgroundColorHighlight,
      color: theme.textHighlight,
    },

    drawerItemActiveText: {
      color: theme.textHighlight,
      fontWeight: "bold",
    },

    modeTogglerContainer: {
      flexDirection: "row",
      alignItems: "center",
      //   justifyContent: "space-between",
      gap: 10,
      paddingHorizontal: 25,
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
      marginTop: 10,
    },
    modeTogglerText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "bold",
    },

    // Floating Button Menu
    floatingButtonContainer: {
      alignItems: "center",
      position: "absolute",
      top: 25,
      left: 40,
    },
    floatingButton: {
      position: "absolute",
      width: 50,
      height: 50,
      borderRadius: 60 / 2,
      borderColor: theme.backgroundColorHighlight,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      shadowRadius: 10,
      shadowColor: theme.background,
      shadowOpacity: 0.3,
      shadowOffset: {
        height: 10,
        width: 0,
      },
    },
    floatingButtonMenu: {
      backgroundColor: theme.background,
    },
    // Barra de progreso
    progress: {
      height: 10,
      backgroundColor: theme.progress,
      borderRadius: 5,
    },

    unfilledProgress: {
      backgroundColor: theme.unfilledProgress,
      height: 10,
      borderRadius: 5,
    },

    // Screens
    screenMainContainer: {
      padding: 2,
      //   margin: 16,
      backgroundColor: theme.background,
      minHeight: "100%",
    },
    screenTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "right",
      marginTop: 30,
      marginRight: 30,
      marginBottom: 30,
    },

    screenText: {
      fontSize: 16,
      color: "#666",
      //   textAlign: "center",
    },

    ScreenContentWrapper: {
      margin: 16,
    },

    //   Claims
    claimCard: {
      backgroundColor: theme.backgroundColorHighlight,
      borderRadius: 8,
      overflow: "hidden",
      marginHorizontal: 16,
      marginBottom: 16,
      elevation: 3, // Para sombra en Android
      shadowColor: "#000", // Para sombra en iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 2,
      borderColor: theme.text,
    },
    claimCardImage: {
      width: "100%",
      height: 150,
    },
    claimCardContent: {
      padding: 16,
      alignItems: "center",
    },
    claimCardTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      width: "100%",
    },
    claimCardIcon: {
      marginRight: 8,
      color: theme.textHighlight,
    },
    claimCardArrowIcon: {
      color: theme.textHighlight,
      marginLeft: 8,
    },
    claimCardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "left",
      flex: 1,
    },
    claimCardDescription: {
      fontSize: 14,
      color: theme.text,
      marginTop: 4,
      textAlign: "center",
    },

    // Estilos para el formulario de descubierto
    formMainView: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      gap: 10,
      //   zIndex: 10,
      //   position: "absolute",
      //   top: 0,
      //   left: 0,
    },
    formContainer: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      gap: 10,
    },
    formTitle: {
      fontSize: 22,
      marginBottom: 40,
      color: theme.text,
      fontFamily: "Lato_900Black",
    },
    formText: {
      fontSize: 16,
      color: theme.text,
      textAlign: "justify",
      marginBottom: 10,
      fontFamily: "Lato_400Regular",
    },
    formLabel: {
      fontSize: 16,
      marginBottom: 5,
      color: theme.text,
    },
    formInput: {
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      color: theme.text,
    },
    formError: {
      fontSize: 14,
      backgroundColor: "#ffeb3b",
      color: "#333",
      padding: 10,
      textAlign: "center",
    },
    formReadOnly: {
      padding: 10,
      borderWidth: 1,
      borderColor: "#000",
      borderRadius: 5,
      backgroundColor: "#ccc",
      marginTop: 5,
    },
    formButton: {
      backgroundColor: theme.buttonPrimary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      shadowColor: theme.text,
      shadowOpacity: 0.3,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    formButtonText: {
      color: theme.buttonTextPrimary,
      fontSize: 16,
      fontWeight: "bold",
    },
    formNavigationButtonsContainer: {
      gap: 10,
      marginTop: 40,
    },
    formLink: {
      color: "#4285F4",
      fontSize: 14,
      textDecorationLine: "underline",
    },
    // Estilos para el componente CollapsibleView
    collapsibleContainer: {
      borderWidth: 1,
      borderColor: theme.background,
      borderRadius: 8,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,

      backgroundColor: theme.background,
    },
    collapsibleHeader: {
      padding: 10,
      backgroundColor: theme.backgroundColorHighlight,
      borderColor: theme.background,
      borderBottomWidth: 1,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    collapsibleHeaderText: {
      color: theme.buttonTextSecondary,
      fontWeight: "bold",
      fontSize: 16,
    },
    collapsibleContent: {
      padding: 10,
      backgroundColor: "transparent",
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    collapsibleContentText: {
      padding: 10,
      fontSize: 16,
      color: theme.text,
    },
    // Estilos para el componente deplegable de bancos
    dropdownContainer: {
      borderWidth: 1,
      borderColor: theme.background,
      borderRadius: 8,
      backgroundColor: theme.background,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.text,
    },
  });
};

export default createStyles;
