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
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import { atualizarUsuario, atualizarSenha } from '../services/userService';
import { 
  validarDataNascimento, 
  validarRenda, 
  validarNome,
  validarSenha 
} from '../utils/validations';

export default function EditarPerfil({ route, navigation }) {
  const { userId, nome: nomeInicial, renda: rendaInicial } = route.params;

  const [nome, setNome] = useState(nomeInicial || '');
  const [renda, setRenda] = useState(rendaInicial || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Estados para mensagens de erro específicas
  const [erroNome, setErroNome] = useState('');
  const [erroRenda, setErroRenda] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const validarCampos = () => {
    let valido = true;

    // Limpa erros anteriores
    setErroNome('');
    setErroRenda('');
    setErroSenha('');

    // Valida nome
    if (!validarNome(nome)) {
      setErroNome('Nome deve ter pelo menos 3 caracteres');
      valido = false;
    }

    // Valida renda
    if (!validarRenda(renda)) {
      setErroRenda('Renda deve ser um número positivo');
      valido = false;
    }

    // Valida senha (se foi preenchida)
    if (novaSenha && !validarSenha(novaSenha)) {
      setErroSenha('Senha deve ter pelo menos 6 caracteres');
      valido = false;
    }

    return valido;
  };

  const salvarAlteracoes = async () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nome || !renda) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    // Valida os campos
    if (!validarCampos()) {
      Alert.alert('Atenção', 'Corrija os erros antes de continuar');
      return;
    }

    setCarregando(true);

    try {
      // Atualiza dados do usuário no Firestore
      const resultadoUsuario = await atualizarUsuario(userId, {
        nome,
        renda
      });

      if (!resultadoUsuario.sucesso) {
        Alert.alert('Erro', resultadoUsuario.erro);
        setCarregando(false);
        return;
      }

      // Se uma nova senha foi fornecida, atualiza a senha
      if (novaSenha) {
        const resultadoSenha = await atualizarSenha(novaSenha);
        if (!resultadoSenha.sucesso) {
          Alert.alert('Aviso', `Dados atualizados, mas houve um erro ao atualizar a senha: ${resultadoSenha.erro}`);
          setCarregando(false);
          return;
        }
      }

      Alert.alert(
        'Sucesso!',
        'Perfil atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar perfil. Tente novamente.');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Editar Perfil" showBack={true} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.descricao}>
            Atualize suas informações abaixo. Deixe o campo de senha em branco se não quiser alterá-la.
          </Text>

          <Text style={styles.label}>Nome completo:</Text>
          <TextInput
            style={[styles.input, erroNome ? styles.inputErro : null]}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              setErroNome('');
            }}
            editable={!carregando}
          />
          {erroNome ? <Text style={styles.textoErro}>{erroNome}</Text> : null}

          <Text style={styles.label}>Renda mensal (R$):</Text>
          <TextInput
            style={[styles.input, erroRenda ? styles.inputErro : null]}
            placeholder="Ex: 3000.00"
            keyboardType="numeric"
            value={renda}
            onChangeText={(text) => {
              setRenda(text);
              setErroRenda('');
            }}
            editable={!carregando}
          />
          {erroRenda ? <Text style={styles.textoErro}>{erroRenda}</Text> : null}

          <Text style={styles.label}>Nova senha (opcional):</Text>
          <TextInput
            style={[styles.input, erroSenha ? styles.inputErro : null]}
            placeholder="Digite uma nova senha (mínimo 6 caracteres)"
            secureTextEntry
            value={novaSenha}
            onChangeText={(text) => {
              setNovaSenha(text);
              setErroSenha('');
            }}
            editable={!carregando}
          />
          {erroSenha ? <Text style={styles.textoErro}>{erroSenha}</Text> : null}

          <TouchableOpacity 
            style={[styles.botao, carregando && styles.botaoDesabilitado]} 
            onPress={salvarAlteracoes}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botaoCancelar} 
            onPress={() => navigation.goBack()}
            disabled={carregando}
          >
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
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
  descricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    color: '#333'
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    fontSize: 16
  },
  inputErro: {
    borderWidth: 1,
    borderColor: '#ff4444'
  },
  textoErro: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8
  },
  botao: {
    backgroundColor: '#A66A6A',
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc'
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  botaoCancelar: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A66A6A'
  },
  botaoCancelarTexto: {
    color: '#A66A6A',
    fontWeight: 'bold',
    fontSize: 16
  }
});
