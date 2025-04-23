import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import { addProduct } from '../services/productService';

export default function AddListingScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price.trim() || !imageUri) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const uploadRes = await api.post('/product/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { imageUrl } = uploadRes.data;

      await addProduct({ title, price, imageUrl });
      Alert.alert('Успех', 'Объявление добавлено!');
      setTitle('');
      setPrice('');
      setImageUri(null);
    } catch (error) {
      console.error('Ошибка при добавлении объявления:', error);
      Alert.alert('Ошибка', 'Не удалось добавить объявление.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Заголовок"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Цена (€)"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Выбрать фото" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Добавить объявление" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});