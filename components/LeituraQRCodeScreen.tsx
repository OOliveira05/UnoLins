import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const LeituraQRCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrCodeData(data);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.qrCodeDataContainer}>
          <Text style={styles.qrCodeDataText}>{qrCodeData}</Text>
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
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  qrCodeDataText: {
    fontSize: 16,
  },
});

export default LeituraQRCodeScreen;
