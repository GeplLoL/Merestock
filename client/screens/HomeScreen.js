import React, { useEffect } from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { loadProducts } from '../redux/productSlice';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.list);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  return (
    <View style={styles.container}>
    <Button
      title="Пользователи"
      onPress={() => navigation.navigate('Users')}
    />

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('Chat', {
              productId: item.id,
              otherUserId: item.userId
            })}
          />
        }
        ListEmptyComponent={
          <Button
            title="Добавить объявление"
            onPress={() => navigation.navigate('AddListing')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
