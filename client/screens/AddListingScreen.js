// src/screens/AddListingScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { createProduct } from '../services/productService';
import { useSelector }   from 'react-redux';

const { width } = Dimensions.get('window');

export default function AddListingScreen({ navigation }) {
  const [title, setTitle]       = useState('');
  const [price, setPrice]       = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const user = useSelector(s => s.user.info);

  const handleSubmit = async () => {
    if (!title || !price) {
      Alert.alert('Viga', 'Sisesta pealkiri ja hind');
      return;
    }
    try {
      await createProduct({
        title,
        price: parseFloat(price),
        imageUrl: imageUrl || undefined,
        userId: user.id
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Viga', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TextInput
          placeholder="Pealkiri"
          placeholderTextColor="#888"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Hind (€)"
          placeholderTextColor="#888"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Pildi URL (valikuline)"
          placeholderTextColor="#888"
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
        />
        <View style={styles.buttonWrapper}>
          <Button title="Avalda" onPress={handleSubmit} color="#3498db" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width - 40,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    height: 45,
    backgroundColor: '#eee',
    borderRadius: 22,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  buttonWrapper: {
    marginTop: 10,
  },
});
