// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";  // Biblioteca para fazer requisições HTTP
import QRCode from "react-native-qrcode-svg";  // Componente para exibição de QR codes
import { captureRef } from "react-native-view-shot";  // Função para capturar uma visão como uma imagem
import * as MediaLibrary from 'expo-media-library';  // API para interação com a biblioteca de mídia
import { getTranslation } from './translation';  // Função para obter traduções com base no idioma selecionado
import AsyncStorage from '@react-native-async-storage/async-storage';  // Biblioteca para armazenamento assíncrono

// Componente funcional para exibir informações de um item de análise
const ItemAnaliseInfo = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

// Componente funcional para exibir uma mensagem de erro
const ErrorMessage = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{translations.ErroCarregarDados}</Text>
  </View>
);

// Componente funcional para a tela de consulta de itens de análise
const ConsultaItemAnaliseScreen = () => {
  // Estados para controlar o carregamento, os itens de análise, erros e visibilidade do QR Code
  const [loading, setLoading] = useState(true);
  const [itensAnalise, setItensAnalise] = useState([]);
  const [error, setError] = useState(null);
  const [qrCodeVisible, setQRCodeVisible] = useState(null);
  const qrCodeContainer = useRef(null);

  // Estados para gerenciar o idioma da interface e as traduções
  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));

  // Efeito para verificar e atualizar o idioma ao carregar o componente
  useEffect(() => {
    const updateLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@language');
        if (savedLanguage && savedLanguage !== language) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error reading language from AsyncStorage', error);
      }
    };

    updateLanguage();
  }, [language]);

  // Efeito para atualizar as traduções com base no idioma selecionado
  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

  // Função para salvar o QR Code na galeria do dispositivo
  const saveQRCodeToCameraRoll = async (uri, fileName) => {
    const asset = await MediaLibrary.createAssetAsync(uri);

    if (asset) {
      Alert.alert(
        translations.Sucesso,
        translations.QRSalvo,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Erro",
        translations.QRNaoSalvo,
        [{ text: "OK" }]
      );
    }
  };

  // Efeito para buscar os itens de análise ao carregar o componente
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

  // Função para gerar o QR Code de um item de análise
  const generateQRCode = async (id) => {
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

  // Função para lidar com a geração do QR Code de um item de análise
  const handleQRCodeGeneration = async (itemAnalise) => {
    setQRCodeVisible(itemAnalise.id);

    try {
      setTimeout(async () => {
        const idQRCode = itemAnalise.id.toString();
        const uri = await generateQRCode(idQRCode);

        await saveQRCodeToCameraRoll(
          uri,
          `qrcode_${itemAnalise.id}.png`
        );

      }, 2000);
    } catch (error) {
      console.error("Erro ao gerar ou salvar o QR Code:", error);
    }
  };

  // Renderização do componente
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
        <Text>{translations.ErroCarregarDados}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {itensAnalise.map((itemAnalise) => (
        <View key={itemAnalise.id}>
          {/* Componente para exibir informações do item de análise */}
          <ItemAnaliseInfo
            label={translations.QntdRecebida}
            value={itemAnalise.quantidadeRecebida}
          />
          <ItemAnaliseInfo
            label={translations.QntdRecebida}
            value={itemAnalise.quantidadeDisponivel}
          />
          <ItemAnaliseInfo label="Unidade" value={itemAnalise.unidade} />
          <ItemAnaliseInfo
            label={translations.tipoMaterial}
            value={itemAnalise.tipoMaterial}
          />
          <ItemAnaliseInfo label="Lote" value={itemAnalise.lote} />
          <ItemAnaliseInfo
            label={translations.NotaFiscal}
            value={itemAnalise.notaFiscal}
          />
          <ItemAnaliseInfo label={translations.QntdRecebida} value={itemAnalise.condicao} />
          <ItemAnaliseInfo
            label={translations.Observacao}
            value={itemAnalise.observacao || "-"}
          />
          <ItemAnaliseInfo
            label={translations.IDSA}
            value={itemAnalise.solicitacaoDeAnaliseId}
          />
          {/* Botão para gerar o QR Code */}
          <TouchableOpacity
            onPress={() => handleQRCodeGeneration(itemAnalise)}
          >
            <View style={styles.qrCodeButton}>
              <Text style={styles.qrCodeButtonText}>{translations.GerarQR}</Text>
            </View>
          </TouchableOpacity>
          {/* Exibição do QR Code */}
          {qrCodeVisible === itemAnalise.id && (
            <View style={styles.qrCodeContainer} ref={qrCodeContainer} collapsable={false}>
              <QRCode
                value={itemAnalise.id.toString()} // Use apenas o ID
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

// Estilos para os componentes
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

// Exporta o componente para ser utilizado em outras partes da aplicação
export default ConsultaItemAnaliseScreen;
