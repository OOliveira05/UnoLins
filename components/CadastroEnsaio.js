// Importação de módulos e bibliotecas necessárias do React Native
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";  // Biblioteca para fazer requisições HTTP
import { getTranslation } from './translation';  // Função para obter traduções com base no idioma selecionado
import AsyncStorage from '@react-native-async-storage/async-storage';  // Biblioteca para armazenamento assíncrono

// Componente funcional para a tela de cadastro de ensaio
const CadastroEnsaioScreen = () => {
  // Estados para controlar a opção selecionada, visibilidade do modal de opções,
  // dados do ensaio, itens de análise e item de análise selecionado
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [nomeEnsaio, setNomeEnsaio] = useState("");
  const [especificacao, setEspecificacao] = useState("");
  const [itensDeAnalise, setItensDeAnalise] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);

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

  // Opções de ensaio disponíveis
  const options = [
    translations.Desintegracao,
    translations.Dissolucao,
    translations.pH,
    translations.Dureza,
    translations.Friabilidade,
    translations.Umidade,
    translations.Viscosidade,
    translations.Solubilidade,
    translations.Teor_do_Ativo,
    translations.Teor_de_Impurezas,
    translations.Particulas_Visiveis,
    translations.Peso_Medio,
    translations.Karl_Fischer,
  ];

  // Efeito para buscar os itens de análise ao carregar o componente
  useEffect(() => {
    axios
      .get("https://uno-lims.up.railway.app/itens-de-analise")
      .then((response) => {
        setItensDeAnalise(response.data);
      })
      .catch((error) => {
        console.error(translations.ErroCarregarDados, error);
      });
  }, []);

  // Função para selecionar um item de análise
  const selecionarItem = (item) => {
    setItemSelecionado(item);
  };

  // Função para cadastrar um ensaio
  const cadastrarEnsaio = async () => {
    try {
      const response = await axios.post(
        "https://uno-lims.up.railway.app/ensaios",
        {
          nomeEnsaio: selectedOption || nomeEnsaio,
          especificacao,
          itemDeAnaliseId: itemSelecionado ? itemSelecionado.id : null,
        }
      );

      console.log("Ensaio cadastrado com sucesso!", response.data);
      Alert.alert(translations.SucessoAoCadastrar);
      setNomeEnsaio("");
      setEspecificacao("");
      setItemSelecionado(null);
      setSelectedOption(null);
    } catch (error) {
      console.error("Erro ao cadastrar ensaio:", error);
      Alert.alert(translations.ErroAoCadastrar);
    }
  };

  // Função para renderizar as opções no modal
  const renderOptions = () => (
    options.map((option) => (
      <TouchableOpacity
        key={option}
        style={styles.modalOption}
        onPress={() => {
          setSelectedOption(option);
          setShowOptionModal(false);
        }}
      >
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

  // Estrutura do componente a ser renderizada
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>{translations.CadastroEnsaio}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowOptionModal(true)}
      >
        <Text>{selectedOption || translations.SelecionarItem}</Text>
      </TouchableOpacity>
      <TextInput
        placeholder={translations.Especificacao}
        value={especificacao}
        onChangeText={setEspecificacao}
        style={styles.input}
      />
      <Text style={styles.label}>{translations.SelecionarItem}</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.itensContainer}
      >
        {itensDeAnalise.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemButton,
              item === itemSelecionado && styles.selectedItemButton,
            ]}
            onPress={() => selecionarItem(item)}
          >
            <Text style={styles.itemButtonText}>
              ID: {item.id}
              {"\n"}
              {translations.QntdRecebida} {item.quantidadeRecebida}
              {"\n"}
              {translations.QntDisponivel}{item.quantidadeDisponivel}
              {"\n"}
              {translations.Unidade} {item.unidade}
              {"\n"}
              {translations.tipoMaterial}{item.tipoMaterial}
              {"\n"}
              {translations.Lote} {item.lote}
              {"\n"}
              {translations.NotaFiscal} {item.notaFiscal}
              {"\n"}
              {translations.Condicao} {item.condicao}
              {"\n"}
              {translations.Observacao} {item.observacao}
              {"\n"}
              {translations.IDSA} {item.solicitacaoDeAnaliseId}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.cadastrarButton}
        onPress={cadastrarEnsaio}
      >
        <Text style={styles.buttonText}>{translations.Cadastrar}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptionModal}
        onRequestClose={() => setShowOptionModal(false)}
      >
        <View style={styles.modalContainer}>
          {renderOptions()}
        </View>
      </Modal>
    </ScrollView>
  );
};

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: '#3A01DF',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  itensContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  itemButton: {
    margin: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 4,
  },
  selectedItemButton: {
    backgroundColor: "#3498db",
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

// Exporta o componente para ser usado em outros lugares do aplicativo
export default CadastroEnsaioScreen;
