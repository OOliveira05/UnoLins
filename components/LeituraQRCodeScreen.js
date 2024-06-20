import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";

const LeituraQRCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermission();
  }, []);

  // Função para lidar com a leitura do QR code
  const handleBarCodeScanned = useCallback(({ type, data }) => {
    setScanned(true);
    setQrCodeData(data);
    // Redirecionar para a tela de detalhes do lote com o ID do QR code
    navigation.navigate("DetalhesLote", { idLote: data });
  }, [navigation]);

  // Função para lidar com o botão "Ler novamente"
  const handleScanAgain = () => {
    setQrCodeData(null); // Limpa os dados do QR code
    setScanned(false); // Reseta o estado de scanned
    handleResetNavigation(); // Reseta a navegação para MainScreen
  };

  // Função para resetar a navegação para MainScreen
  const handleResetNavigation = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainScreen" }], // Substitua "MainScreen" pelo nome correto da sua tela inicial
    });
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permissão para acessar a câmera negada.</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.qrCodeDataContainer}>
          <Text style={styles.qrCodeDataText}>QR Code lido: {qrCodeData}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleScanAgain} // Ação para ler novamente
          >
            <Text style={styles.buttonText}>Ler novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  qrCodeDataContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  qrCodeDataText: {
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LeituraQRCodeScreen;
