import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const showAlert = (pealkiri, sõnum) => {
    if (Platform.OS === 'web') {
      window.alert(`${pealkiri}\n\n${sõnum}`);
    } else {
      Alert.alert(pealkiri, sõnum);
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      showAlert('Viga', 'Sisesta e-post ja parool');
      return;
    }
    try {
      const res = await fetch('http://localhost:7023/api/User/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok) {
        showAlert('Success', 'Registreerumine edukas');
        navigation.navigate('Login');
      } else {
        showAlert('Registreerimise viga', json.message || 'Proovi uuesti');
      }
    } catch (e) {
      console.error(e);
      showAlert('Võrgu viga', 'Serveriga ühendus ebaõnnestus');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registreeru</Text>

        <TextInput
          placeholder="E-post"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Parool"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
                <TextInput
          placeholder="Parool"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Loo konto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>On juba konto? Sisselogimine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:             1,
    paddingTop:       Platform.OS === 'android' ? 25 : 0,
    backgroundColor:  '#f9f9f9',
    justifyContent:   'center',
    alignItems:       'center',
  },
  card: {
    width:            '80%',
    backgroundColor:  '#fff',
    padding:          20,
    borderRadius:     12,
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOpacity: 0.1,
        shadowRadius:  6,
        shadowOffset:  { width: 0, height: 3 },
      },
      android: { elevation: 3 },
    }),
  },
  title: {
    fontSize:    24,
    fontWeight:  '700',
    color:       '#333',
    textAlign:   'center',
    marginBottom: 20,
  },
  input: {
    height:           45,
    backgroundColor:  '#eee',
    borderRadius:     22,
    paddingHorizontal:15,
    fontSize:         16,
    color:            '#333',
    marginBottom:     15,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius:    8,
    paddingVertical: 12,
    alignItems:      'center',
    marginTop:       5,
  },
  buttonText: {
    fontSize:   16,
    fontWeight: '600',
    color:      '#fff',
  },
  link: {
    marginTop:   15,
    alignItems:  'center',
  },
  linkText: {
    fontSize: 14,
    color:    '#007AFF',
  },
});
