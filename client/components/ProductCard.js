import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {product.imageUrl 
        ? <Image source={{ uri: product.imageUrl }} style={styles.image} /> 
        : <View style={styles.placeholder}><Text>No Image</Text></View>}
      <View style={styles.info}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.price} €</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', marginBottom: 15 },
  image: { width: '100%', height: 150 },
  placeholder: { width: '100%', height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' },
  info: { padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { marginTop: 5, color: '#888' }
});
