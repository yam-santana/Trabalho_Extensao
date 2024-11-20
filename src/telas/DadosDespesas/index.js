import { View, TouchableOpacity, Alert } from "react-native";
import { EntradaTexto } from "../../componentes/EntradaTexto";
import Botao from "../../componentes/Botao";
import estilos from "./estilos";
import React, { useState } from "react";
import { salvarDespesas, atualizarDespesas, deletarDespesas } from "../../servicos/firestore";
import { Alerta } from "../../componentes/Alerta";
import Icon from "react-native-vector-icons/Feather";

export default function DadosDespesas({ navigation, route }) {
  const [nome, setNome] = useState(route?.params?.nome || "");
  const [preco, setPreco] = useState(route?.params?.preco || "");
  const [mensagem, setMensagem] = useState("");
  const [mostrarMensagem, setMostrarMensagem] = useState(false);

  const validarPreco = (texto) => {
    const formatado = texto.replace(",", ".").replace(/[^0-9.]/g, ""); // Apenas números e ponto
    const regex = /^\d*\.?\d{0,2}$/; // Valida até duas casas decimais
    if (regex.test(formatado)) {
      setPreco(formatado.replace(".", ",")); // Troca ponto por vírgula para formato brasileiro
    }
  };

  async function salvar() {
    if (nome == "" || preco == "") {
      setMensagem("Por favor preencha todos os campos");
      setMostrarMensagem(true);
      return;
    }

    let resultado = "";
    if (route?.params) {
      resultado = await atualizarDespesas(route?.params?.id, {
        nome,
        preco,
      });
    } else {
      resultado = await salvarDespesas({
        nome,
        preco,
      });
    }

    if (resultado == "erro") {
      setMensagem("Erro ao salvar despesa");
      setMostrarMensagem(true);
    } else {
      navigation.goBack();
    }
  }

  async function deletar() {
    Alert.alert("Deletar despesa", "Tem certeza que quer deletar a despesa?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          deletarDespesas(route?.params?.id);
          navigation.goBack();
        },
        style: "default",
      },
    ]);
  }

  return (
    <View style={estilos.container}>
      {route?.params && (
        <TouchableOpacity onPress={() => deletar()}>
          <Icon name="trash-2" size={20} color="#000" />
        </TouchableOpacity>
      )}

      <EntradaTexto
        label="Descrição da depesa"
        value={nome}
        onChangeText={(texto) => setNome(texto)}
      />
      <EntradaTexto
        label="Preço da despesa"
        value={preco}
        onChangeText={validarPreco}
        keyboardType="numeric"
      />

      <Botao onPress={() => salvar()}>Salvar</Botao>

      <Alerta
        mensagem={mensagem}
        error={mostrarMensagem}
        setError={setMostrarMensagem}
      />
    </View>
  );
}
