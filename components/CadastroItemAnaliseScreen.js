// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';  // Biblioteca para fazer requisições HTTP
import { getTranslation } from './translation';  // Função para obter traduções com base no idioma selecionado
import AsyncStorage from '@react-native-async-storage/async-storage';  // Biblioteca para armazenamento assíncrono

// Componente funcional para a tela de cadastro de itens de análise
const CadastroItemAnaliseScreen = () => {
  // Estados para controlar os campos do formulário
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('');
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [lote, setLote] = useState('');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [condicao, setCondicao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

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

  // Efeito para buscar as solicitações de análise ao carregar o componente
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

  // Função para lidar com a seleção de uma solicitação de análise
  const handleSolicitacaoSelect = (solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    console.log('ID da Solicitação de Análise selecionada:', solicitacao.id);
  };

  // Função para limpar os campos do formulário
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

  // Função para cadastrar um item de análise
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
      
      // Requisição POST para cadastrar o item de análise
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
      Alert.alert(translations.SucessoAoCadastrar);

      limparCampos();
    } catch (error) {
      console.error('Erro ao cadastrar item de análise:', error);
      Alert.alert('Erro', translations.ErroAoCadastrar);
    }
  };

  

  // Renderização do componente
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>{translations.CadastroItemAnalise}</Text>
        {/* Campos do formulário para o cadastro de itens de análise */}
        <TextInput
          placeholder={translations.Quantidade}
          value={quantidade}
          onChangeText={setQuantidade}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder={translations.Unidade}
          value={unidade}
          onChangeText={setUnidade}
          style={styles.input}
        />
        <TextInput
          placeholder={translations.tipoMaterial}
          value={tipoMaterial}
          onChangeText={setTipoMaterial}
          style={styles.input}
        />
        <TextInput
          placeholder={translations.Lote}
          value={lote}
          onChangeText={setLote}
          style={styles.input}
        />
        <TextInput
          placeholder={translations.NotaFiscal}
          value={notaFiscal}
          onChangeText={setNotaFiscal}
          style={styles.input}
        />
        <TextInput
          placeholder={translations.Condicao}
          value={condicao}
          onChangeText={setCondicao}
          style={styles.input}
        />
        <TextInput
          placeholder={translations.Observacao}
          value={observacao}
          onChangeText={setObservacao}
          style={styles.input}
        />
        {/* Texto para indicar a seleção de uma solicitação de análise */}
        <Text style={styles.label}>{translations.SelecioneSA}</Text>
        {/* Lista de botões para seleção de solicitação de análise */}
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

        {/* Botão para cadastrar o item de análise */}
        <TouchableOpacity
          style={styles.cadastrarButton}
          onPress={cadastrarItemAnalise}
        >
          <Text style={styles.buttonText}>{translations.Cadastrar}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Estilos para os componentes
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

// Exporta o componente para ser utilizado em outras partes da aplicação
export default CadastroItemAnaliseScreen;
