import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout }      from '../redux/userSlice';

export default function HeaderLogout({ navigation }) {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        dispatch(logout());
        navigation.navigate('Login');
      }}
    >
      <Text style={styles.text}>Выйти</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { marginRight: 12 },
  text:   { color: '#007AFF', fontSize: 16 },
});
