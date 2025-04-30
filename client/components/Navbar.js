import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, useNavigation }  from '@react-navigation/native';
import { logout } from '../redux/userSlice';

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigation = useNavigation();
  const route      = useRoute();
  const token      = useSelector(s => s.user.token);
  const user       = useSelector(s => s.user.info);

  // Peidame nav-bari sisselogimis- ja registreerimisekraanidel
  if (route.name === 'Login' || route.name === 'Signup') {
    return null;
  }

  return (
    <View style={styles.container}>
      {token && user ? (
        <>
          <Text style={styles.greeting}>Tere, {user.email}!</Text>
          <Button
            title="Logi välja"
            onPress={() => {
              dispatch(logout());
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }}
          />
        </>
      ) : (
        <>
          <Button title="Logi sisse" onPress={() => navigation.navigate('Login')} />
          <Button title="Registreeru" onPress={() => navigation.navigate('Signup')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    alignItems:     'center',
    padding:        10,
    backgroundColor:'#fff',
    borderBottomWidth:1,
    borderColor:    '#eee',
  },
  greeting: {
    marginRight: 15,
    fontSize:    16,
  },
});
