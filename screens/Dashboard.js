import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';

export default function Dashboard({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Dashboard" showBack={true} onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        <Text style={styles.greeting}>Olá! Vamos acompanhar sua carteira hoje?</Text>

        <View style={styles.cardSaldo}>
          <Text style={styles.saldoTitulo}>Saldo Total</Text>
          <Text style={styles.saldoValor}>R$ 55.000</Text>
          <Text style={styles.rentabilidade}>Rentabilidade de 5,2% no mês</Text>
        </View>

        <View style={styles.alerta}>
          <Text style={styles.alertaEmoji}>⚠️</Text>
          <Text style={styles.alertaTexto}>
            Investimento não é aposta. Use o Moneychat para aprender e tomar decisões conscientes.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Moneychat')}
        >
          <Text style={styles.botaoTexto}>Falar com o Moneychat</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoSecundario}>
          <Text style={styles.botaoTextoSecundario}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
  },
  greeting: {
    fontSize: 16,
    marginBottom: 20
  },
  cardSaldo: {
    backgroundColor: '#FFD6D6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20
  },
  saldoTitulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4
  },
  saldoValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000'
  },
  rentabilidade: {
    fontSize: 14,
    color: '#444',
    marginTop: 4
  },
  alerta: {
    flexDirection: 'row',
    backgroundColor: '#F9F1A5',
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
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  botao: {
    backgroundColor: '#A66A6A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  botaoSecundario: {
    marginTop: 16,
    alignItems: 'center'
  },
  botaoTextoSecundario: {
    color: '#A66A6A',
    fontSize: 16,
    fontWeight: '500'
  }
});
