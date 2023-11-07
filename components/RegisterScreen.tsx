import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const RegistroUsuarioScreen = () => {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const registrarUsuario = async () => {
    try {
      const response = await axios.post(
        "https://uno-lims.up.railway.app/auth/cadastrar",
        {
          nome,
          cargo,
          email,
          senha,
        }
      );

      console.log("Usuário registrado com sucesso!", response.data);

      setNome("");
      setCargo("");
      setEmail("");
      setSenha("");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Registro de Usuário</Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
        style={styles.input}
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Registrar" onPress={registrarUsuario} />
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
});

export default RegistroUsuarioScreen;
