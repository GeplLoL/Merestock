// src/screens/AddListingScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import { createProduct } from '../services/productService';
import { useSelector }  from 'react-redux';

export default function AddListingScreen({ navigation }) {
  const [title, setTitle]       = useState('');
  const [price, setPrice]       = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const user = useSelector(s => s.user.info);

  const handleSubmit = async () => {
    if (!title || !price) {
      Alert.alert('Ошибка', 'Введите заголовок и цену');
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
      Alert.alert('Ошибка', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Заголовок"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Цена"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="URL картинки (необязательно)"
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <Button title="Опубликовать" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding:20 },
  input:     {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:4,
    padding:10,
    marginBottom:15
  },
});
