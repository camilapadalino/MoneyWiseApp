import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import { autenticarUsuario, observarEstadoAutenticacao } from '../services/userService';
import { validarEmail } from '../utils/validations';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  useEffect(() => {
    // Observa mudanças no estado de autenticação
    const unsubscribe = observarEstadoAutenticacao((user) => {
      if (user) {
        // Usuário está autenticado, navega para a tela principal
        navigation.replace('Main', { screen: 'Dashboard' });
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const validarCampos = () => {
    let valido = true;

    // Limpa erros anteriores
    setErroEmail('');
    setErroSenha('');

    // Valida e-mail
    if (!email) {
      setErroEmail('E-mail é obrigatório');
      valido = false;
    } else if (!validarEmail(email)) {
      setErroEmail('E-mail inválido');
      valido = false;
    }

    // Valida senha
    if (!senha) {
      setErroSenha('Senha é obrigatória');
      valido = false;
    }

    return valido;
  };

  const realizarLogin = async () => {
    // Valida os campos
    if (!validarCampos()) {
      return;
    }

    setCarregando(true);

    try {
      // Autentica usuário no Firebase
      const resultado = await autenticarUsuario(email, senha);

      if (resultado.sucesso) {
      } else {
        Alert.alert('Erro ao fazer login', resultado.erro);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao autenticar. Tente novamente.');
      console.error('Erro no login:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Login" showBack={true} onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={[styles.input, erroEmail ? styles.inputErro : null]}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErroEmail('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!carregando}
        />
        {erroEmail ? <Text style={styles.textoErro}>{erroEmail}</Text> : null}

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={[styles.input, erroSenha ? styles.inputErro : null]}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setErroSenha('');
          }}
          secureTextEntry
          editable={!carregando}
        />
        {erroSenha ? <Text style={styles.textoErro}>{erroSenha}</Text> : null}

        <TouchableOpacity 
          style={[styles.botao, carregando && styles.botaoDesabilitado]} 
          onPress={realizarLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.cadastrarbotao, carregando && styles.botaoDesabilitado]} 
          onPress={() => navigation.navigate('Cadastro')}
          disabled={carregando}
        >
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
    marginBottom: 4,
    color: '#333'
  },
  input: {
    height: 45,
    borderRadius: 8,
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 16
  },
  inputErro: {
    borderWidth: 1,
    borderColor: '#ff4444'
  },
  textoErro: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 16
  },
  botao: {
    backgroundColor: '#A66A6A',
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc'
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
