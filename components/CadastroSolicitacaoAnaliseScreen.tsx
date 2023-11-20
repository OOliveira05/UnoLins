import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

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

  const cadastrarSolicitacaoAnalise = async () => {
    try {
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
      Alert.alert('Sucesso', 'Solicitação de análise cadastrada com sucesso!');
      limparCampos();
    } catch (error) {
      console.error('Erro ao cadastrar solicitação de análise:', error);
      Alert.alert('Erro', 'Erro ao cadastrar solicitação de análise!');
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
  };

  return (
    <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Cadastro de Solicitação de Análise</Text>
          <TextInput
            placeholder="Nome do Projeto"
            value={nomeProjeto}
            onChangeText={setNomeProjeto}
            style={styles.input}
          />
          <TextInput
            placeholder="Prazo Acordado"
            value={prazoAcordado}
            onChangeText={setPrazoAcordado}
            style={styles.input}
          />
          <TextInput
            placeholder="Tipo de Análise"
            value={tipoDeAnalise}
            onChangeText={setTipoDeAnalise}
            style={styles.input}
          />
          <TextInput
            placeholder="Descrição dos Serviços"
            value={descricaoDosServicos}
            onChangeText={setDescricaoDosServicos}
            style={styles.input}
          />
          <TextInput
            placeholder="Informações Adicionais"
            value={informacoesAdicionais}
            onChangeText={setInformacoesAdicionais}
            style={styles.input}
          />
          <TextInput
            placeholder="Modo de Envio do Resultado"
            value={modoEnvioResultado}
            onChangeText={setModoEnvioResultado}
            style={styles.input}
          />
          <TextInput
            placeholder="Responsável Abertura"
            value={responsavelAbertura}
            onChangeText={setResponsavelAbertura}
            style={styles.input}
          />
          <Text style={styles.label}>Selecione um Solicitante:</Text>
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

          <TouchableOpacity
            style={styles.cadastrarButton}
            onPress={cadastrarSolicitacaoAnalise}
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
});

export default CadastroSolicitacaoAnaliseScreen;
