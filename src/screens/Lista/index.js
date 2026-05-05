import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
import { listContacts, deleteContact } from '../../database/Database';

export default function Lista({ navigation }) {

  const [contatos, setContatos] = useState([]);

  const carregarContatos = useCallback(() => {
    listContacts()
      .then((dados) => setContatos(dados))
      .catch((error) => {
        console.warn('Erro ao listar contatos', error);
        Alert.alert('Erro', 'Nao foi possivel carregar os contatos.');
      });
  }, []);

  useEffect(() => {
    carregarContatos();
    const unsubscribe = navigation.addListener('focus', carregarContatos);
    return unsubscribe;
  }, [navigation, carregarContatos]);

  // useCallback: confirma remocao antes de chamar a query DELETE.
  const confirmarRemocao = useCallback(
    (id) => {
      Alert.alert('Remover contato', 'Deseja remover este contato?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            deleteContact(id)
              .then(carregarContatos)
              .catch((error) => {
                console.warn('Erro ao remover contato', error);
                Alert.alert('Erro', 'Nao foi possivel remover o contato.');
              });
          },
        },
      ]);
    },
    [carregarContatos]
  );

  // useCallback: navegacao para o formulario, com params quando edicao.
  const irParaCadastro = useCallback(
    (contato) => {
      // Params: o objeto contato e enviado para pre-preencher o formulario.
      navigation.navigate('Cadastro', { contato });
    },
    [navigation]
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Pressable style={styles.itemInfo} onPress={() => irParaCadastro(item)}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.telefone}>{item.telefone}</Text>
      </Pressable>

      {/* ✅ Botão de remover agora chama confirmarRemocao */}
      <TouchableOpacity
        style={styles.remover}
        onPress={() => confirmarRemocao(item.id)}
      >
        <Text style={styles.removerTexto}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contatos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={contatos.length === 0 ? styles.vazioContainer : undefined}
        ListEmptyComponent={<Text style={styles.vazioTexto}>Nenhum contato cadastrado.</Text>}
      />

      <TouchableOpacity style={styles.adicionar} onPress={() => irParaCadastro(null)}>
        <Text style={styles.adicionarTexto}>+ Novo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  telefone: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },
  remover: {
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  removerTexto: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
  },
  adicionar: {
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  adicionarTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  vazioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vazioTexto: {
    fontSize: 14,
    color: '#6b7280',
  },
});