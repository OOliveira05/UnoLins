import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const CadastroEnsaioScreen = () => {
  const [nomeEnsaio, setNomeEnsaio] = useState("");
  const [especificacao, setEspecificacao] = useState("");
  const [itensDeAnalise, setItensDeAnalise] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  useEffect(() => {
    axios
      .get("https://uno-lims.up.railway.app/itens-de-analise")
      .then((response) => {
        setItensDeAnalise(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar lista de itens de análise:", error);
      });
  }, []);

  const selecionarItem = (item) => {
    setItemSelecionado(item);
  };

  const cadastrarEnsaio = async () => {
    try {
      const response = await axios.post(
        "https://uno-lims.up.railway.app/ensaios",
        {
          nomeEnsaio,
          especificacao,
          itemDeAnaliseId: itemSelecionado ? itemSelecionado.id : null,
        }
      );

      console.log("Ensaio cadastrado com sucesso!", response.data);
      alert("Ensaio cadastrado com sucesso!");
      setNomeEnsaio("");
      setEspecificacao("");
      setItemSelecionado(null);
    } catch (error) {
      console.error("Erro ao cadastrar ensaio:", error);
      alert("Erro ao cadastrar ensaio!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cadastro de Ensaio</Text>
      <TextInput
        placeholder="Nome do Ensaio"
        value={nomeEnsaio}
        onChangeText={setNomeEnsaio}
        style={styles.input}
      />
      <TextInput
        placeholder="Especificação"
        value={especificacao}
        onChangeText={setEspecificacao}
        style={styles.input}
      />
      <Text style={styles.label}>Selecione um Item de Análise:</Text>
      <View style={styles.itensContainer}>
        {itensDeAnalise.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemButton,
              item === itemSelecionado && styles.selectedItemButton,
            ]}
            onPress={() => selecionarItem(item)}
          >
            <Text>{item.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Cadastrar" onPress={cadastrarEnsaio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  itensContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  itemButton: {
    margin: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  selectedItemButton: {
    backgroundColor: "#e0e0e0",
  },
});

export default CadastroEnsaioScreen;
