// src/screens/HomeScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Image,
  TextInput,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProducts }  from '../services/productService';
import { useSelector }    from 'react-redux';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [products, setProducts]       = useState([]);
  const [status, setStatus]           = useState('idle');
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder]     = useState('asc');
  const [minPrice, setMinPrice]       = useState('');
  const [maxPrice, setMaxPrice]       = useState('');

  const user = useSelector(s => s.user.info);

  const load = async () => {
    try {
      setStatus('loading');
      const data = await fetchProducts();
      setProducts(data);
      setStatus('idle');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  };

  useFocusEffect(useCallback(load, []));

  // Фильтрация и сортировка
  const filtered = useMemo(() => {
    const q   = searchQuery.trim().toLowerCase();
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    return products
      .filter(p =>
        (p.title.toLowerCase().includes(q) ||
         p.userEmail.toLowerCase().includes(q)) &&
        p.price >= min &&
        p.price <= max
      )
      .sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
  }, [products, searchQuery, sortOrder, minPrice, maxPrice]);

  if (status === 'loading') {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }
  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Proovi uuesti" onPress={load} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        {/* Добавляем кнопку «Lisa kuulutus» */}
        <View style={styles.addBtnWrapper}>
          <Button
            title="Lisa kuulutus"
            onPress={() => navigation.navigate('AddListing')}
            color="#3498db"
          />
        </View>

        <Text style={styles.controlLabel}>Otsi</Text>
        <TextInput
          style={styles.input}
          placeholder="Nimi või autor"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <Text style={styles.controlLabel}>Sortimine hinna järgi</Text>
        <View style={styles.sortBtns}>
          <TouchableOpacity
            style={[styles.sortBtn, sortOrder === 'asc' && styles.sortBtnActive]}
            onPress={() => setSortOrder('asc')}
          >
            <Text style={styles.sortTxt}>↑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortOrder === 'desc' && styles.sortBtnActive]}
            onPress={() => setSortOrder('desc')}
          >
            <Text style={styles.sortTxt}>↓</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.controlLabel}>Hinnavahemik</Text>
        <TextInput
          style={styles.input}
          placeholder="Min €"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Max €"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{item.price} €</Text>
            <Text style={styles.by}>alates {item.userEmail}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Kuulutusi veel pole.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#f9f9f9',
  },
  controls: {
    width: width * 0.25,
    padding: 10,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#ececec',
  },
  addBtnWrapper: {
    marginBottom: 15,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  sortBtns: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  sortBtnActive: {
    backgroundColor: '#3498db',
  },
  sortTxt: {
    fontSize: 16,
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ececec',
    width: width * 0.55,
    alignSelf: 'center',
  },
  image: { width: '100%', height: 150 },
  imagePlaceholder: { width: '100%', height: 150, backgroundColor: '#ddd' },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 10,
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
    margin: 10,
  },
  by: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  empty: {
    flex: 1,
    textAlign: 'center',
    marginTop: height * 0.3,
    color: '#999',
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#e74c3c', textAlign: 'center', marginBottom: 10 },
});
