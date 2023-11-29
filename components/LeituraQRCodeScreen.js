// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner"; // Biblioteca para leitura de QR code
import { useNavigation } from "@react-navigation/native"; // Hook de navegação

// Componente funcional para a tela de leitura de QR code
const LeituraQRCodeScreen = () => {
  // Estados para verificar permissão, status de leitura e dados do QR code
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);

  // Hook de navegação para redirecionar para outra tela
  const navigation = useNavigation();

  // Efeito para solicitar permissão ao acessar a câmera
  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermission();
  }, []);

  // Função chamada quando um QR code é escaneado
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrCodeData(data);

    // Redirecionar para a tela de detalhes do item de análise com o ID do QR code
    navigation.navigate("DetalhesItemAnaliseScreen", { itemId: data });
  };

  // Renderização condicional com base na permissão da câmera
  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permissão para acessar a câmera negada.</Text>;
  }

  // Componente principal
  return (
    <View style={styles.container}>
      {/* Componente BarCodeScanner para ler QR code */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Exibição dos dados do QR code após a leitura */}
      {scanned && (
        <View style={styles.qrCodeDataContainer}>
          <Text style={styles.qrCodeDataText}>{qrCodeData}</Text>
        </View>
      )}
    </View>
  );
};

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  qrCodeDataContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  qrCodeDataText: {
    fontSize: 16,
  },
});

// Exporta o componente para ser usado em outros lugares do aplicativo
export default LeituraQRCodeScreen;
