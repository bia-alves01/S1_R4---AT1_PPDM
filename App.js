import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Lista from './src/screens/Lista';
import Cadastro from './src/screens/Cadastro';
import { initDatabase } from './src/database/Database';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase().catch((error) => {
      console.warn('Erro ao inicializar banco de dados', error);
      Alert.alert('Erro', 'Nao foi possivel inicializar o banco de dados.');
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen name="Lista" component={Lista} options={{ title: 'Contatos' }} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Cadastro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
