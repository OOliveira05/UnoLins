import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';

const RegistroUsuarioScreen = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const registrarUsuario = async () => {
    try {

      if (senha !== confirmarSenha) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
      }
      const response = await axios.post(
        "https://uno-lims.up.railway.app/auth/cadastrar",
        {
          nome,
          cargo,
          email,
          senha,
          confirmarSenha
        }
      );

      console.log("Usuário registrado com sucesso!", response.data);
      Alert.alert("Sucesso", "Usuário registrado com sucesso!");

      setNome("");
      setCargo("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert("Erro", "Erro ao registrar usuário. Verifique suas informações e tente novamente.");
      console.error("Erro ao registrar usuário:", error);
    }
  };

  return (
    <ScrollView>
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
        <TextInput
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.registrarButton}
          onPress={registrarUsuario}
          >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    borderColor: '#3A01DF',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  registrarButton: {
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

export default RegistroUsuarioScreen;
