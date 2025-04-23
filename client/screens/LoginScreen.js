// src/screens/LoginScreen.js


import React, { useEffect, useState } from 'react';
 import {
   View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity
 } from 'react-native';
 import { useDispatch } from 'react-redux';


export default function LoginScreen({ navigation, route }) {
   const [email, setEmail]       = useState('');
   const [password, setPassword] = useState('');
   const dispatch = useDispatch();

   const handleLogin = async () => {
     console.log('👉 fetch begin');
     try {
       const res = await fetch('http://localhost:7023/api/User/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password }),
       });
       console.log('👉 fetch status', res.status);
       const json = await res.json();
       console.log('👉 fetch json', json);
     } catch (e) {
       console.error('fetch error', e);
     }
   };

   return (
     <View style={styles.container}>
       <Text style={styles.title}>[LoginScreen]</Text>
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
         value={password}
         onChangeText={setPassword}
         secureTextEntry
       />
       <Button title="Войти" onPress={handleLogin} />
       {/* Теперь navigation defined */}
       <TouchableOpacity
         onPress={() => navigation.navigate('Signup')}
         style={styles.link}
       >
         <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
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
