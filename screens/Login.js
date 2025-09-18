import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Header';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const salvarUsuario = async () => {
    if (!email || !senha) return Alert.alert('Preencha todos os campos!');
    try {
      await AsyncStorage.setItem('usuario', JSON.stringify({ email, senha }));
      Alert.alert('Cadastro realizado com sucesso!');
      setEmail('');
      setSenha('');
    } catch (error) {
      Alert.alert('Erro ao salvar usuário');
    }
  };

  const autenticarUsuario = async () => {
    try {
      const dados = await AsyncStorage.getItem('usuario');
      if (dados) {
        const { email: salvo, senha: salva } = JSON.parse(dados);
        if (email === salvo && senha === salva) {
          navigation.replace('Main', { screen: 'Dashboard' });
        } else {
          Alert.alert('E-mail ou senha incorretos');
        }
      } else {
        Alert.alert('Usuário não encontrado. Cadastre-se primeiro.');
      }
    } catch (error) {
      Alert.alert('Erro ao autenticar');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Login" showBack={true} onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.botao} onPress={autenticarUsuario}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cadastrarbotao} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4
  },
  input: {
    height: 45,
    borderRadius: 8,
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 50
  },
  botao: {
    backgroundColor: '#A66A6A',
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },
  cadastrarbotao: {
    backgroundColor: '#A66A6A',
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
  },
  link: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  }
});
