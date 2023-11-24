import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, TouchableHighlight } from 'react-native';
import axios from 'axios';
import { getTranslation } from './translation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroSolicitacaoAnaliseScreen = () => {
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

  const [language, setLanguage] = useState('portuguese');
  const [translations, setTranslations] = useState(getTranslation(language));

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

  useEffect(() => {
    setTranslations(getTranslation(language));
  }, [language]);

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

  const handleSolicitanteSelect = (solicitante) => {
    setSolicitanteSelecionado(solicitante);
  };

  const validateDateFormat = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  };

  const [showTipoDeAnaliseModal, setShowTipoDeAnaliseModal] = useState(false);
  const [showModoEnvioResultadoModal, setShowModoEnvioResultadoModal] = useState(false);
  
  const cadastrarSolicitacaoAnalise = async () => {
    try {
      if (!validateDateFormat(prazoAcordado)) {
        setIsValidDate(false);
        return;
      }

      if (!tipoDeAnaliseValues.includes(tipoDeAnalise) || !modoEnvioResultadoValues.includes(modoEnvioResultado)) {
        Alert.alert('Erro', translations.ValoresInvalidos);
        return;
      }

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
      limparCampos();
    } catch (error) {
      console.error('Erro ao cadastrar solicitação de análise:', error);
      Alert.alert('Erro', translations.ErroSA);
    }
  };

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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>{translations.CadastroSA}</Text>
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

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTipoDeAnaliseModal(true)}
        >
          <Text>{tipoDeAnalise || translations.SelecioneTipodeAnalise}</Text>
        </TouchableOpacity>

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

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowModoEnvioResultadoModal(true)}
        >
          <Text>{modoEnvioResultado || translations.SelecioneodoEnvioResultado}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder={translations.Responsavel}
          value={responsavelAbertura}
          onChangeText={setResponsavelAbertura}
          style={styles.input}
        />

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

        <TouchableOpacity style={styles.cadastrarButton} onPress={cadastrarSolicitacaoAnalise}>
          <Text style={styles.buttonText}>{translations.Cadastrar}</Text>
        </TouchableOpacity>

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

export default CadastroSolicitacaoAnaliseScreen;
