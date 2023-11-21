import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';


const ItemAnaliseInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const ErrorMessage = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Ocorreu um erro ao carregar os dados.</Text>
  </View>
);

const ConsultaItemAnaliseScreen = () => {
  const [loading, setLoading] = useState(true);
  const [itensAnalise, setItensAnalise] = useState([]);
  const [error, setError] = useState(null);
  const [qrCodeVisible, setQRCodeVisible] = useState(null);
  const qrCodeContainer = useRef(null);

  const saveQRCodeToCameraRoll = async (uri, fileName) => {
    const asset = await MediaLibrary.createAssetAsync(uri);

    if (asset) {
      // Altere a mensagem de sucesso para um alerta
      Alert.alert(
        "Sucesso",
        "QR Code salvo com sucesso na galeria da câmera!",
        [{ text: "OK" }]
      );
    } else {
      // Altere a mensagem de erro para um alerta
      Alert.alert(
        "Erro",
        "Erro ao salvar o QR Code no rolo da câmera.",
        [{ text: "OK" }]
      );
    }
  };

  

  useEffect(() => {
    axios
      .get("https://uno-lims.up.railway.app/itens-de-analise")
      .then((response) => {
        setItensAnalise(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const generateQRCode = async (content) => {
  try {
    if (qrCodeContainer.current) {
      const uri = await new Promise((resolve, reject) => {
        requestAnimationFrame(async () => {
          try {
            const captureUri = await captureRef(qrCodeContainer.current, {
              format: 'png',
              quality: 0.8,
            });
            resolve(captureUri);
          } catch (captureError) {
            reject(new Error(`Erro ao capturar a visão: ${captureError.message}`));
          }
        });
      });

      return uri;
    } else {
      throw new Error('Ref qrCodeContainer não definido');
    }
  } catch (error) {
    console.error('Erro ao gerar o QR Code:', error.message);
    throw error;
  }
};



const handleQRCodeGeneration = async (itemAnalise) => {
  setQRCodeVisible(itemAnalise.id);

  try {
    // Atraso de 2 segundos (2000 milissegundos)
    setTimeout(async () => {
      const uri = await generateQRCode(JSON.stringify(itemAnalise));

      // Salvar o QR Code no rolo da câmera
      await saveQRCodeToCameraRoll(
        uri,
        `qrcode_${itemAnalise.id}.png`
      );

    }, 2000); // Tempo de atraso de 2 segundos
  } catch (error) {
    console.error("Erro ao gerar ou salvar o QR Code:", error);
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessage />;
  }

  if (itensAnalise.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Não há itens de análise disponíveis.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {itensAnalise.map((itemAnalise) => (
        <View key={itemAnalise.id}>
          <ItemAnaliseInfo
            label="Quantidade Recebida"
            value={itemAnalise.quantidadeRecebida}
          />
          <ItemAnaliseInfo
            label="Quantidade Disponível"
            value={itemAnalise.quantidadeDisponivel}
          />
          <ItemAnaliseInfo label="Unidade" value={itemAnalise.unidade} />
          <ItemAnaliseInfo
            label="Tipo de Material"
            value={itemAnalise.tipoMaterial}
          />
          <ItemAnaliseInfo label="Lote" value={itemAnalise.lote} />
          <ItemAnaliseInfo
            label="Nota Fiscal"
            value={itemAnalise.notaFiscal}
          />
          <ItemAnaliseInfo label="Condição" value={itemAnalise.condicao} />
          <ItemAnaliseInfo
            label="Observação"
            value={itemAnalise.observacao || "-"}
          />
          <ItemAnaliseInfo
            label="ID Solicitação de Análise"
            value={itemAnalise.solicitacaoDeAnaliseId}
          />
          <TouchableOpacity
            onPress={() => handleQRCodeGeneration(itemAnalise)}
          >
            <View style={styles.qrCodeButton}>
              <Text style={styles.qrCodeButtonText}>Gerar QR Code</Text>
            </View>
          </TouchableOpacity>
          {qrCodeVisible === itemAnalise.id && (
            <View style={styles.qrCodeContainer} ref={qrCodeContainer} collapsable={false}>
              <QRCode
                value={JSON.stringify(itemAnalise)} // Pode ajustar conforme necessário
                size={150}
                color="black"
                backgroundColor="white"
              />
            </View>
          )}
          <View style={styles.separator} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  qrCodeButton: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  qrCodeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default ConsultaItemAnaliseScreen;
