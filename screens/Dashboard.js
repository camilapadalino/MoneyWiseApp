import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import { 
  buscarDadosUsuario, 
  fazerLogout, 
  excluirUsuario,
  observarEstadoAutenticacao 
} from '../services/userService';

export default function Dashboard({ navigation }) {
  const [nome, setNome] = useState('');
  const [renda, setRenda] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Observa mudanças no estado de autenticação
    const unsubscribe = observarEstadoAutenticacao((user) => {
      if (user) {
        setUserId(user.uid);
        carregarDados(user.uid);
      } else {
        // Usuário não está autenticado, navega para o login
        navigation.replace('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const carregarDados = async (uid) => {
    try {
      setCarregando(true);
      const resultado = await buscarDadosUsuario(uid);

      if (resultado.sucesso) {
        const { nome, renda } = resultado.dados;
        setNome(nome);
        setRenda(renda);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar seus dados.');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Erro ao carregar dados. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          onPress: async () => {
            const resultado = await fazerLogout();
            if (resultado.sucesso) {
              navigation.replace('Login');
            } else {
              Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const handleEditarPerfil = () => {
    // Navega para a tela de edição de perfil
    navigation.navigate('EditarPerfil', { userId, nome, renda });
  };

  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setCarregando(true);
            const resultado = await excluirUsuario(userId);
            setCarregando(false);

            if (resultado.sucesso) {
              Alert.alert(
                'Conta Excluída',
                'Sua conta foi excluída com sucesso.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.replace('Login')
                  }
                ]
              );
            } else {
              Alert.alert('Erro', resultado.erro);
            }
          }
        }
      ]
    );
  };

  if (carregando) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A66A6A" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Dashboard" showBack={false} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Olá, {nome?.split(' ')[0]}! Vamos acompanhar sua carteira hoje?</Text>

        <View style={styles.cardSaldo}>
          <Text style={styles.saldoTitulo}>Renda mensal</Text>
          <Text style={styles.saldoValor}>R$ {renda || '----'}</Text>
          <Text style={styles.rentabilidade}>Rentabilidade de X,X% no mês</Text>
        </View>

        <View style={styles.alerta}>
          <Text style={styles.alertaEmoji}>⚠️</Text>
          <Text style={styles.alertaTexto}>
            Investimento não é aposta. Use o Moneychat para aprender e tomar decisões conscientes.
          </Text>
        </View>

        <View style={styles.devAviso}>
          <Text style={styles.devEmoji}>🚧</Text>
          <Text style={styles.devTexto}>
            O Moneychat ainda está em desenvolvimento. Em breve, ele responderá suas perguntas com ainda mais precisão!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Moneychat')}
        >
          <Text style={styles.botaoTexto}>Falar com o Moneychat</Text>
        </TouchableOpacity>

        {/* Botões de gerenciamento de conta */}
        <View style={styles.acoesContainer}>
          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={handleEditarPerfil}
          >
            <Text style={styles.botaoSecundarioTexto}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={handleLogout}
          >
            <Text style={styles.botaoSecundarioTexto}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoSecundario, styles.botaoExcluir]}
            onPress={handleExcluirConta}
          >
            <Text style={[styles.botaoSecundarioTexto, styles.botaoExcluirTexto]}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40
  },
  greeting: {
    fontSize: 18,
    marginBottom: 20,
    color: '#A66A6A',
    fontWeight: 'bold'
  },
  cardSaldo: {
    backgroundColor: '#FFD6D6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20
  },
  saldoTitulo: {
    fontSize: 20,
    color: '#333',
    marginBottom: 4
  },
  saldoValor: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
  },
  rentabilidade: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
    textAlign: 'center'
  },
  alerta: {
    flexDirection: 'row',
    backgroundColor: '#D0A5A5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
    marginBottom: 20
  },
  alertaEmoji: {
    fontSize: 18,
    marginRight: 8
  },
  alertaTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  devAviso: {
    flexDirection: 'row',
    backgroundColor: '#FFF3C4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'flex-start'
  },
  devEmoji: {
    fontSize: 18,
    marginRight: 8
  },
  devTexto: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flex: 1
  },
  botao: {
    backgroundColor: '#A66A6A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  acoesContainer: {
    marginTop: 30,
    gap: 12
  },
  botaoSecundario: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  botaoSecundarioTexto: {
    color: '#A66A6A',
    fontSize: 16,
    fontWeight: '500'
  },
  botaoExcluir: {
    backgroundColor: '#ffe0e0',
    borderColor: '#ffcccc'
  },
  botaoExcluirTexto: {
    color: '#cc0000'
  }
});