import { db } from "../config/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, onSnapshot } from "firebase/firestore"

export async function salvarDespesas(data){
  try {
    await addDoc(collection(db, 'despesas'), data)
    return 'ok'
  } catch(error){
    console.log('Erro add despesas:', error)
    return 'erro'
  }
}

export async function pegarDespesas() {
  try {
    const querySnapshot = await getDocs(collection(db, "despesas"));
    let despesas = []; // Array para armazenar as despesas
    querySnapshot.forEach((doc) => {
      const despesa = { id: doc.id, ...doc.data() }; // Cria um objeto para cada despesa
      despesas.push(despesa); // Adiciona ao array de despesas
    });
    return despesas; // Retorna o array de despesas
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function pegarDespesasTempoReal(setDespesas){
  const ref = query(collection(db, "despesas"))
  onSnapshot(ref, (querySnapshot) => {
    const despesas = []
    querySnapshot.forEach(( doc ) => {
      despesas.push({id: doc.id, ...doc.data()})
    })
    setDespesas(despesas)
  })
}

export async function totalizarDespesas() {
  try {
    const despesas = await pegarDespesas(); // Obtém as despesas usando a função existente
    const total = despesas.reduce((acc, despesa) => {
      const valor = parseFloat(despesa.preco) || 0; // Garante que o valor seja numérico
      return acc + valor;
    }, 0);
    return total; // Retorna o total
  } catch (error) {
    console.log("Erro ao totalizar despesas:", error);
    return 0; // Retorna 0 em caso de erro
  }
}


export async function atualizarDespesas(despesasID, data){
  try {
    const despesasRef = doc(db, "despesas", despesasID);
    await updateDoc(despesasRef, data)
    return 'ok'
  }
  catch(error){
    console.log(error)
    return 'error'
  }
}

export async function deletarDespesas(despesasID){
  try {
    const despesasRef = doc(db, "despesas", despesasID);
    await deleteDoc(despesasRef)
    return 'ok'
  }
  catch(error){
    console.log(error)
    return 'error'
  }
}