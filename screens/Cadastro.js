import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Header';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [renda, setRenda] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const salvarCadastro = async () => {
  if (!nome || !dataNascimento || !renda || !email || !senha) {
    Alert.alert('Preencha todos os campos!');
    return;
  }

  try {
    const usuarioExistente = await AsyncStorage.getItem('usuario');

    if (usuarioExistente) {
      const { email: emailSalvo } = JSON.parse(usuarioExistente);
      if (email === emailSalvo) {
        Alert.alert('Este e-mail já possui cadastro.');
        return;
      }
    }

    
    await AsyncStorage.setItem(
      'dadosUsuario',
      JSON.stringify({ nome, dataNascimento, renda })
    );

   
    await AsyncStorage.setItem(
      'usuario',
      JSON.stringify({ email, senha })
    );

    Alert.alert('Cadastro realizado com sucesso!');
    navigation.navigate('Login');
  } catch (error) {
    Alert.alert('Erro ao salvar cadastro');
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Cadastro" showBack={true} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Nome completo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Data de nascimento:</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            value={dataNascimento}
            onChangeText={setDataNascimento}
          />

          <Text style={styles.label}>Renda mensal (R$):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 30.000"
            keyboardType="numeric"
            value={renda}
            onChangeText={setRenda}
          />

          <Text style={styles.label}>E-mail:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.botao} onPress={salvarCadastro}>
            <Text style={styles.botaoTexto}>Salvar e continuar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8
  },
  botao: {
    backgroundColor: '#A66A6A',
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
