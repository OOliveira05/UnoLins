// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, TouchableHighlight } from 'react-native';
import axios from 'axios';  // Biblioteca para fazer requisições HTTP
import { getTranslation } from './translation';  // Função para obter traduções com base no idioma selecionado
import AsyncStorage from '@react-native-async-storage/async-storage';  // Biblioteca para armazenamento assíncrono

// Componente funcional para a tela de cadastro de solicitação de análise
const CadastroSolicitacaoAnaliseScreen = () => {
  // Estados para armazenar os dados do formulário
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [prazoAcordado, setPrazoAcordado] = useState('');
  const [tipoDeAnalise, setTipoDeAnalise] = useState('');
  const [descricaoDosServicos, setDescricaoDosServicos] = useState('');
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
  const [modoEnvioResultado, setModoEnvioResultado] = useState('');
  const [solicitantes, setSolicitantes] = useState([]);
  const [solicitanteSelecionado, setSolicitanteSelecionado] = useState(null);
  const [responsavelAbertura, setResponsavelAbertura] = useState('');
  const [isValidDate, setIsValidDate] = useState(true);

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

  // Valores possíveis para os campos "tipoDeAnalise" e "modoEnvioResultado"
  const tipoDeAnaliseValues = [
    'Desenvolvimento',
    'Degradacao_Forcada',
    'Validacao',
    'Controle',
    'Solubilidade',
    'Estabilidade',
    'Perfil_de_Dissolucao',
    'Solventes_Residuais',
    'Sumario_de_Validacao',
  ];

  const modoEnvioResultadoValues = ['VIRTUAL', 'VALER', 'CLIENTE', 'CORREIOS'];

  // Efeito para buscar a lista de solicitantes ao carregar o componente
  useEffect(() => {
    axios
      .get('https://uno-lims.up.railway.app/solicitantes')
      .then((response) => {
        setSolicitantes(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar lista de solicitantes:', error);
      });
  }, []);

  // Função para lidar com a seleção de um solicitante
  const handleSolicitanteSelect = (solicitante) => {
    setSolicitanteSelecionado(solicitante);
  };

  // Função para validar o formato da data
  const validateDateFormat = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  };

  // Estados para controlar a exibição dos modais de seleção
  const [showTipoDeAnaliseModal, setShowTipoDeAnaliseModal] = useState(false);
  const [showModoEnvioResultadoModal, setShowModoEnvioResultadoModal] = useState(false);
  
  // Função para cadastrar a solicitação de análise
  const cadastrarSolicitacaoAnalise = async () => {
    try {
      // Validação do formato da data
      if (!validateDateFormat(prazoAcordado)) {
        setIsValidDate(false);
        return;
      }

      // Validação dos valores selecionados nos dropdowns
      if (!tipoDeAnaliseValues.includes(tipoDeAnalise) || !modoEnvioResultadoValues.includes(modoEnvioResultado)) {
        Alert.alert('Erro', translations.ValoresInvalidos);
        return;
      }

      // Requisição para cadastrar a solicitação de análise
      const response = await axios.post('https://uno-lims.up.railway.app/solicitacoes-de-analise', {
        nomeProjeto,
        prazoAcordado,
        tipoDeAnalise,
        descricaoDosServicos,
        informacoesAdicionais,
        modoEnvioResultado,
        solicitante: solicitanteSelecionado ? solicitanteSelecionado.cnpj : null,
        responsavelAbertura,
      });

      console.log('Solicitação de análise cadastrada com sucesso!', response.data);
      Alert.alert(translations.Sucesso, translations.Sucesso);
      limparCampos();  // Limpa os campos do formulário após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar solicitação de análise:', error);
      Alert.alert('Erro', translations.ErroSA);
    }
  };

  // Função para limpar os campos do formulário
  const limparCampos = () => {
    setNomeProjeto('');
    setPrazoAcordado('');
    setTipoDeAnalise('');
    setDescricaoDosServicos('');
    setInformacoesAdicionais('');
    setModoEnvioResultado('');
    setSolicitanteSelecionado(null);
    setResponsavelAbertura('');
    setIsValidDate(true);
  };

  // Função para renderizar as opções dos dropdowns
  const renderDropdownOptions = (options, setSelected, showModal, selectedValue) => (
    options.map((option) => (
      <TouchableOpacity
        key={option}
        style={styles.modalOption}
        onPress={() => {
          setSelected(option);
          showModal(false);
        }}
      >
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

  // Renderização do componente
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Título da tela */}
        <Text style={styles.headerText}>{translations.CadastroSA}</Text>

        {/* Inputs para o formulário */}
        <TextInput
          placeholder={translations.NomeProjeto}
          value={nomeProjeto}
          onChangeText={setNomeProjeto}
          style={styles.input}
        />
        <TextInput
          placeholder={translations.PrazoAcordado}
          value={prazoAcordado}
          onChangeText={(text) => {
            setPrazoAcordado(text);
            setIsValidDate(true);
          }}
          style={[styles.input, !isValidDate && styles.errorInput]}
        />

        {/* Dropdown para o tipo de análise */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTipoDeAnaliseModal(true)}
        >
          <Text>{tipoDeAnalise || translations.SelecioneTipodeAnalise}</Text>
        </TouchableOpacity>

        {/* Inputs adicionais */}
        <TextInput
          placeholder={translations.DescriçãoServicos}
          value={descricaoDosServicos}
          onChangeText={setDescricaoDosServicos}
          style={styles.input}
        />
        <TextInput
          placeholder={translations.InformacoesAdicionais}
          value={informacoesAdicionais}
          onChangeText={setInformacoesAdicionais}
          style={styles.input}
        />

        {/* Dropdown para o modo de envio do resultado */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowModoEnvioResultadoModal(true)}
        >
          <Text>{modoEnvioResultado || translations.SelecioneodoEnvioResultado}</Text>
        </TouchableOpacity>

        {/* Input para o responsável pela abertura da solicitação */}
        <TextInput
          placeholder={translations.Responsavel}
          value={responsavelAbertura}
          onChangeText={setResponsavelAbertura}
          style={styles.input}
        />

        {/* Label e lista de solicitantes disponíveis para seleção */}
        <Text style={styles.label}>{translations.SelecioneSolicitante}</Text>
        <View style={styles.solicitantesContainer}>
          {solicitantes.map((solicitante) => (
            <TouchableOpacity
              key={solicitante.cnpj}
              style={[
                styles.solicitanteButton,
                solicitante === solicitanteSelecionado && styles.selectedSolicitanteButton,
              ]}
              onPress={() => handleSolicitanteSelect(solicitante)}
            >
              <Text>{solicitante.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão para cadastrar a solicitação de análise */}
        <TouchableOpacity style={styles.cadastrarButton} onPress={cadastrarSolicitacaoAnalise}>
          <Text style={styles.buttonText}>{translations.Cadastrar}</Text>
        </TouchableOpacity>

        {/* Modais para seleção de valores nos dropdowns */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showTipoDeAnaliseModal}
          onRequestClose={() => setShowTipoDeAnaliseModal(false)}
        >
          <View style={styles.modalContainer}>
            {renderDropdownOptions(tipoDeAnaliseValues, setTipoDeAnalise, setShowTipoDeAnaliseModal, tipoDeAnalise)}
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModoEnvioResultadoModal}
          onRequestClose={() => setShowModoEnvioResultadoModal(false)}
        >
          <View style={styles.modalContainer}>
            {renderDropdownOptions(modoEnvioResultadoValues, setModoEnvioResultado, setShowModoEnvioResultadoModal, modoEnvioResultado)}
          </View>
        </Modal>
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
  solicitantesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  solicitanteButton: {
    margin: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  selectedSolicitanteButton: {
    backgroundColor: '#e0e0e0',
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
  errorInput: {
    borderColor: 'red',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

// Exporta o componente para ser utilizado em outras partes da aplicação
export default CadastroSolicitacaoAnaliseScreen;
