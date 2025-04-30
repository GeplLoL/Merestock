// src/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProducts }  from '../services/productService';
import { useSelector }    from 'react-redux';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus]     = useState('idle'); 
  const [error, setError]       = useState(null);

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

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  if (status === 'loading') {
    return <ActivityIndicator style={styles.center} size="large" />;
  }
  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Повторить" onPress={load} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Привет, {user?.email || 'гость'}!
      </Text>
      <Button
        title="Добавить объявление"
        onPress={() => navigation.navigate('AddListing')}
      />
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{item.price} ₽</Text>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
              />
            ) : null}
            <Text style={styles.by}>от {item.userEmail}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Пока нет объявлений.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, padding:10 },
  center:      { flex:1, justifyContent:'center', alignItems:'center' },
  error:       { color:'red', marginBottom:10 },
  welcome:     { fontSize:18, marginBottom:10 },
  card:        { marginBottom:12, padding:10, borderWidth:1, borderColor:'#ddd', borderRadius:4 },
  title:       { fontSize:16, fontWeight:'bold' },
  price:       { marginTop:4 },
  by:          { marginTop:6, fontStyle:'italic', fontSize:12, color:'#555' },
  image:       { width:'100%', height:200, resizeMode:'cover', marginTop:8 },
  empty:       { textAlign:'center', marginTop:20, color:'#777' },
});
