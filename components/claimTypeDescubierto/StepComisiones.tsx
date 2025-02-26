import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import createStyles from "@/assets/styles/themeStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Comision {
  fecha: string;
  importe: string;
}

interface StepComisionesProps {
  stepId: string;
  data: { comisiones?: Comision[] };
  updateData: (
    stepId: string,
    data: Record<string, any>,
    isInFireBase: boolean
  ) => void;
  goToStep: (stepId: string) => void;
  setCanContinue: (canContinue: boolean) => void;
  claimCode?: string;
}

const StepComisiones: React.FC<StepComisionesProps> = ({
  stepId,
  data,
  updateData,
  goToStep,
  setCanContinue,
  claimCode,
}) => {
  const { isDarkMode } = useTheme();
  const styles = createStyles(isDarkMode);

  const [comisiones, setComisiones] = useState<Comision[]>(
    data.comisiones || [{ fecha: "", importe: "" }]
  );
  const [total, setTotal] = useState<number>(0);
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    // console.log(comisiones);
    setCanContinue(false);
    updateTotal(comisiones);
  }, [comisiones]);

  useEffect(() => {
    const loadStoredComisiones = async () => {
      try {
        const storedData = await AsyncStorage.getItem("formData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (claimCode && parsedData[claimCode]?.comisiones) {
            setComisiones(parsedData[claimCode].comisiones);
          }
        }
      } catch (error) {
        console.error("Error loading comisiones from AsyncStorage", error);
      }
    };

    loadStoredComisiones();
  }, [claimCode]);

  const updateTotal = (comisiones: Comision[]) => {
    const suma = comisiones.reduce(
      (acc, curr) => acc + (parseFloat(curr.importe) || 0),
      0
    );
    setTotal(suma);
    updateData(stepId, { ...data, comisiones }, true);
    setCanContinue(comisiones.every((com) => com.fecha && com.importe));
  };

  const handleDateConfirm = (date: Date) => {
    if (selectedIndex !== null) {
      const updatedComisiones = [...comisiones];
      updatedComisiones[selectedIndex].fecha = format(date, "yyyy-MM-dd");
      setComisiones(updatedComisiones);
    }
    setIsDatePickerVisible(false);
  };

  const handleInputChange = (
    index: number,
    field: keyof Comision,
    value: string
  ) => {
    const updatedComisiones = [...comisiones];
    updatedComisiones[index][field] = value;
    setComisiones(updatedComisiones);
  };

  const addComision = () => {
    setComisiones([...comisiones, { fecha: "", importe: "" }]);
  };

  const removeComision = (index: number) => {
    const updatedComisiones = comisiones.filter((_, i) => i !== index);
    setComisiones(updatedComisiones);
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Añade los cargos y fechas de las comisiones
      </Text>
      {comisiones.map((comision, index) => (
        <View key={index} style={[pageStyles.comisionRow, { width: "100%" }]}>
          <TouchableOpacity
            style={[pageStyles.dateButton, { flex: 1 }]}
            onPress={() => {
              setSelectedIndex(index);
              setIsDatePickerVisible(true);
            }}
          >
            <Text
              style={
                comision.fecha
                  ? pageStyles.dateText
                  : pageStyles.placeholderText
              }
            >
              {comision.fecha || "Fecha"}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={[pageStyles.inputSmall, { flex: 1 }]}
            onChangeText={(text) => handleInputChange(index, "importe", text)}
            value={comision.importe}
            placeholder="Importe"
            keyboardType="numeric"
          />

          {comisiones.length > 1 && (
            <TouchableOpacity
              onPress={() => removeComision(index)}
              style={[pageStyles.removeButtonSmall, { flex: 0.5 }]}
            >
              <Text style={pageStyles.removeText}>-</Text>
            </TouchableOpacity>
          )}

          {index === comisiones.length - 1 && (
            <TouchableOpacity
              onPress={addComision}
              style={[pageStyles.addButtonSmall, { flex: 0.5 }]}
            >
              <Text style={pageStyles.addText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
      />

      <Text style={pageStyles.total}>Total Importes: {total.toFixed(2)} €</Text>
    </ScrollView>
  );
};

const pageStyles = StyleSheet.create({
  comisionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    fontSize: 16,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 5,
  },
  dateText: {
    color: "#000",
    fontSize: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  removeButtonSmall: {
    backgroundColor: "#ff4d4d",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  removeText: { fontSize: 26, color: "#fff" },
  addButtonSmall: {
    backgroundColor: "#4caf50",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  addText: {
    fontSize: 26,
    color: "#fff",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
  },
});

export default StepComisiones;
