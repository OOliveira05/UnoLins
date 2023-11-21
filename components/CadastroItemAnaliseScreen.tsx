import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';

const CadastroItemAnaliseScreen = () => {
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('');
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [lote, setLote] = useState('');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [condicao, setCondicao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [qrCodeValue, setQRCodeValue] = useState('');

  useEffect(() => {
    axios
      .get('https://uno-lims.up.railway.app/solicitacoes-de-analise')
      .then((response) => {
        setSolicitacoes(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar lista de solicitações de análise:', error);
      });
  }, []);

  const handleSolicitacaoSelect = (solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    console.log('ID da Solicitação de Análise selecionada:', solicitacao.id);
  };

  const cadastrarItemAnalise = async () => {
    try {
      const quantidadeInt = parseInt(quantidade, 10);
      console.log('Informações enviadas para a API:', {
        quantidade: quantidadeInt,
        unidade,
        tipoMaterial,
        lote,
        notaFiscal,
        condicao,
        observacao,
        solicitacaoDeAnaliseId: solicitacaoSelecionada ? solicitacaoSelecionada.id : null,
      });
      
      const response = await axios.post('https://uno-lims.up.railway.app/itens-de-analise', {
        quantidade: quantidadeInt,
        unidade,
        tipoMaterial,
        lote,
        notaFiscal,
        condicao,
        observacao,
        solicitacaoDeAnaliseId: solicitacaoSelecionada ? solicitacaoSelecionada.id : null,
      });

      console.log('Item de análise cadastrado com sucesso!', response.data);
      Alert.alert('Sucesso', 'Item de análise cadastrado com sucesso!');

      const itemId = response.data.id; // Assuming the API returns the ID of the item
      setQRCodeValue(itemId); // Set the QR code value

      limparCampos();
    } catch (error) {
      console.error('Erro ao cadastrar item de análise:', error);
      Alert.alert('Erro', 'Erro ao cadastrar item de análise!');
    }
  };

  const limparCampos = () => {
    setQuantidade('');
    setUnidade('');
    setTipoMaterial('');
    setLote('');
    setNotaFiscal('');
    setCondicao('');
    setObservacao('');
    setSolicitacaoSelecionada(null);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Cadastro de Item de Análise</Text>
        <TextInput
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Unidade"
          value={unidade}
          onChangeText={setUnidade}
          style={styles.input}
        />
        <TextInput
          placeholder="Tipo de Material"
          value={tipoMaterial}
          onChangeText={setTipoMaterial}
          style={styles.input}
        />
        <TextInput
          placeholder="Lote"
          value={lote}
          onChangeText={setLote}
          style={styles.input}
        />
        <TextInput
          placeholder="Nota Fiscal"
          value={notaFiscal}
          onChangeText={setNotaFiscal}
          style={styles.input}
        />
        <TextInput
          placeholder="Condição"
          value={condicao}
          onChangeText={setCondicao}
          style={styles.input}
        />
        <TextInput
          placeholder="Observação"
          value={observacao}
          onChangeText={setObservacao}
          style={styles.input}
        />
        <Text style={styles.label}>Selecione uma Solicitação de Análise:</Text>
        <View style={styles.solicitacoesContainer}>
          {solicitacoes.map((solicitacao) => (
            <TouchableOpacity
              key={solicitacao.id}
              style={[
                styles.solicitacaoButton,
                solicitacao === solicitacaoSelecionada && styles.selectedSolicitacaoButton,
              ]}
              onPress={() => handleSolicitacaoSelect(solicitacao)}
            >
              <Text>{solicitacao.nomeProjeto}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {qrCodeValue && (
          <View style={styles.qrCodeContainer}>
            <Text style={styles.label}>QR Code do Item:</Text>
            <QRCode
              value={String(qrCodeValue)}
              size={150}
              color="black"
              backgroundColor="white"
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.cadastrarButton}
          onPress={cadastrarItemAnalise}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#3A01DF',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  solicitacoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  solicitacaoButton: {
    margin: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  selectedSolicitacaoButton: {
    backgroundColor: '#e0e0e0',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cadastrarButton: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CadastroItemAnaliseScreen;
