import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/usersSlice';

export default function ProfileScreen() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Button title="Выйти" onPress={() => dispatch(logout())} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  text: { fontSize:18, marginBottom:20 },
});
