import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers } from '../redux/usersSlice';

export default function UsersScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  if (status === 'loading') {
    return <ActivityIndicator style={styles.loader} />;
  }
  if (status === 'failed') {
    return <Text style={styles.error}>Ошибка: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            onPress={() =>
              navigation.navigate('Chat', {
                otherUserId: item.id,
              })
            }
          >
            {item.email}
          </Text>
        )}
        ListEmptyComponent={<Text>Пользователи не найдены</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  loader:    { flex: 1, justifyContent: 'center' },
  error:     { color: 'red', textAlign: 'center', marginTop: 20 },
  item:      { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
});
