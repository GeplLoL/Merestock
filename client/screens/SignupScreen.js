
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity
} from 'react-native';
import { useDispatch } from 'react-redux';
import authService from '../services/authService';
import { setUser } from '../redux/userSlice';

export default function SignupScreen({ navigation, route }) {
  useEffect(() => console.log('📝 mounted', route.name), []);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      return Alert.alert('Ошибка', 'Заполните все поля');
    }
    if (password !== confirm) {
      return Alert.alert('Ошибка', 'Пароли не совпадают');
    }
    try {
      const data = await authService.register(email, password);
      if (!data.token) {
        return Alert.alert('Ошибка', data.message || 'Не удалось зарегистрироваться');
      }
      dispatch(setUser({ token: data.token, info: data }));
    } catch (err) {
      console.error('Register error', err);
      Alert.alert('Ошибка регистрации', err.message || 'Попробуйте ещё раз');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>[SignupScreen]</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address"
      />
      <TextInput
        placeholder="Пароль"
        style={styles.input}
        value={password} onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Повторите пароль"
        style={styles.input}
        value={confirm} onChangeText={setConfirm}
        secureTextEntry
      />
      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', padding:20 },
  title:    { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input:    { borderBottomWidth:1, marginBottom:20, padding:10 },
  link:     { marginTop:12, alignItems:'center' },
  linkText: { color:'#0066CC' },
});
