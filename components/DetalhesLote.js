import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const DetalhesLote = () => {
  const [lote, setLote] = useState(null);
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeVisible, setQRCodeVisible] = useState(false);
  const qrCodeContainer = useRef(null);
  const route = useRoute();
  const { idLote } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    fetchLote();
    fetchAnalises();
  }, []);

  const fetchLote = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/lote/${idLote}`;
      const response = await axios.get(url);
      setLote(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalises = async () => {
    setLoading(true);
    try {
      const url = `https://uno-api-pdre.onrender.com/api/v1/analise/${idLote}`;
      const response = await axios.get(url);
      setAnalises(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarAnalise = () => {
    navigation.navigate('CadastrarAnalise', { idLote });
  };

  const generateQRCode = async () => {
    try {
      if (qrCodeContainer.current) {
        const uri = await captureRef(qrCodeContainer.current, {
          format: 'png',
          quality: 0.8,
        });

        const asset = await MediaLibrary.createAssetAsync(uri);
        if (asset) {
          Alert.alert('Sucesso', 'QR Code salvo na galeria.', [{ text: 'OK' }]);
        } else {
          Alert.alert('Erro', 'Falha ao salvar QR Code.', [{ text: 'OK' }]);
        }
      }
    } catch (error) {
      console.error('Erro ao gerar ou salvar o QR Code:', error);
      Alert.alert('Erro', 'Falha ao gerar ou salvar QR Code.', [{ text: 'OK' }]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar dados do lote.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Id Solicitação de Análise</Text>
          <Text style={styles.text}>{lote.solicitacaoAnalise.idSa}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Nome do Projeto</Text>
          <Text style={styles.text}>{lote.solicitacaoAnalise.nomeProjeto}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Amostra</Text>
          <Text style={styles.text}>{lote.amostra}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Nota Fiscal</Text>
          <Text style={styles.text}>{lote.notaFiscal}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Data de Entrada</Text>
          <Text style={styles.text}>{lote.dataEntrada}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Data de Validade</Text>
          <Text style={styles.text}>{lote.dataValidade}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Quantidade</Text>
          <Text style={styles.text}>{lote.quantidade}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.text}>{lote.descricao === '' ? '-' : lote.descricao}</Text>
        </View>
      </View>

      <View style={styles.analisesContainer}>
        <View style={styles.analisesHeader}>
          <Text style={styles.analisesHeaderText}>Análises</Text>
          <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarAnalise}>
            <Text style={styles.cadastrarButtonText}>Cadastrar Análise</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.analisesList}>
          {analises.map((analise, index) => (
            <View key={analise.id} style={styles.analiseItem}>
              <Text style={styles.analiseItemText}>{`Análise ${index + 1}`}</Text>
              <Text style={styles.analiseItemText}>{`Especificação: ${analise.especificacao}`}</Text>
              <Text style={styles.analiseItemText}>{`Resultado: ${analise.resultado}`}</Text>
              <Text style={styles.analiseItemText}>{`Unidade: ${analise.unidade}`}</Text>
              <Text style={styles.analiseItemText}>{`Observação: ${analise.observacao}`}</Text>
              <Text style={styles.analiseItemText}>{`Ensaio: ${analise.ensaio ? analise.ensaio.nome : '-'}`}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.qrCodeSection}>
        <TouchableOpacity
          style={styles.qrCodeButton}
          onPress={() => setQRCodeVisible(true)}
        >
          <Text style={styles.qrCodeButtonText}>Gerar QR Code</Text>
        </TouchableOpacity>
        {qrCodeVisible && (
          <View style={styles.qrCodeContainer} ref={qrCodeContainer} collapsable={false}>
            <QRCode
              value={idLote.toString()} // Use apenas o ID do lote
              size={150}
              color="black"
              backgroundColor="white"
            />
          </View>
        )}
        {qrCodeVisible && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={generateQRCode}
          >
            <Text style={styles.saveButtonText}>Salvar QR Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  analisesContainer: {
    marginTop: 20,
  },
  analisesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  analisesHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cadastrarButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cadastrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analisesList: {
    marginTop: 10,
  },
  analiseItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  analiseItemText: {
    fontSize: 16,
    color: '#555',
  },
  qrCodeSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrCodeButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  qrCodeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetalhesLote;
