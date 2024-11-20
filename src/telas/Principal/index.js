import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  RefreshControl, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import Cabecalho from '../../componentes/Cabecalho';
import Despesas from '../../componentes/Despesas';
import estilos from './estilos';
import { auth } from '../../config/firebase';
import { BotaoDespesas } from '../../componentes/BotaoDespesas';
import { pegarDespesas, pegarDespesasTempoReal } from '../../servicos/firestore';

export default function Principal({ navigation }) {
  const usuario = auth.currentUser;
  const [despesas, setDespesas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalDespesas, setTotalDespesas] = useState(0);

  const carregarDadosDespesas = async () => {
    setRefreshing(true);
    const despesasFirestore = await pegarDespesas();
    setDespesas(despesasFirestore);
    calcularTotal(despesasFirestore);
    setRefreshing(false);
  };

  const calcularTotal = (despesas) => {
    const total = despesas.reduce((acc, despesa) => {
      const valor = parseFloat(
        despesa.preco.toString().replace(',', '.')
      ) || 0; // Substitui vírgula por ponto para calcular corretamente
      return acc + valor;
    }, 0);
    setTotalDespesas(total);
  };

  useEffect(() => {
    carregarDadosDespesas();
    pegarDespesasTempoReal(setDespesas); 
  }, []);

  useEffect(() => {
    calcularTotal(despesas);
  }, [despesas]);

  const deslogar = () => {
    auth.signOut();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.innerContainer}>
        <Cabecalho logout={deslogar} />
        <Text style={estilos.bemVindoText}>Bem-vindo, {usuario.email}</Text>
        <View style={estilos.totalDespesasContainer}>
          <Text style={estilos.totalDespesasTitle}>Total das Despesas</Text>
          <Text style={estilos.totalDespesasValue}>
            R$ {totalDespesas.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <ScrollView
          style={estilos.listaDespesasContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={carregarDadosDespesas}
            />
          }
        >
          {despesas?.map((despesa) => {
            return (
              <TouchableOpacity
                key={despesa.id}
                onPress={() => navigation.navigate('DadosDespesas', despesa)}
              >
                <Despesas nome={despesa.nome} preco={despesa.preco} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={estilos.botaoContainer}>
        <BotaoDespesas onPress={() => navigation.navigate('DadosDespesas')} />
      </View>
    </SafeAreaView>
  );
}
