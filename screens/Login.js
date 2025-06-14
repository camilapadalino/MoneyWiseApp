import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
     <Header
        title="Login"
        showBack={true}
        onBack={() => navigation.navigate('Home')}/>

      <View style={styles.container}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333'
  },
  input: {
    height: 45,
    borderRadius: 8,
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#A66A6A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: 'center'
  },
  secondaryText: {
    color: '#A66A6A',
    fontSize: 16,
    fontWeight: '500'
  }
});
