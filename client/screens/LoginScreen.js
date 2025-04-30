// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Button,
  Alert, Platform, StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser }     from '../redux/userSlice';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const showAlert = (title, msg) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Ошибка', 'Введите email и пароль');
      return;
    }
    try {
      const res = await fetch(
        'http://localhost:7023/api/User/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }
      );
      const json = await res.json();
      console.log('💬 /login:', json);

      const token =
        json.token ??
        json.accessToken ??
        (json.data && json.data.token) ??
        null;

      if (res.ok && token) {
        dispatch(setUser({ token, info: json.user ?? json }));
        navigation.navigate('Home');
      } else {
        showAlert('Ошибка входа', json.message || 'Неверный логин или пароль');
      }
    } catch (e) {
      console.error(e);
      showAlert('Ошибка сети', 'Не удалось подключиться к серверу');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Пароль"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleLogin} />
      <Button
        title="Нет аккаунта? Регистрация"
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  title:     { fontSize:24, textAlign:'center', marginBottom:20 },
  input:     { borderWidth:1, borderColor:'#ccc', borderRadius:4, padding:10, marginBottom:15 },
});
