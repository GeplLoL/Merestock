import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TextInput, Button, StyleSheet } from 'react-native';
import connection from '../services/socketService';
import api from '../services/api';

export default function ChatScreen({ route }) {
  const { userId, otherUserId, productId } = route.params;
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connection.start().then(() => {
      connection.on('ReceiveMessage', newMsg =>
        setMessages(prev => [...prev, newMsg])
      );
    });
    return () => connection.off('ReceiveMessage');
  }, []);

  const send = async () => {
    if (!msg.trim()) return;
    try {
      await api.post('/chat/send', {
        content: msg,
        senderId: userId,
        receiverId: otherUserId,
        productId: productId,
      });
      setMsg('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View
      key={index.toString()}
      style={[styles.bubble, item.senderId === userId ? styles.mine : styles.theirs]}
    >
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={msg}
          onChangeText={setMsg}
          placeholder="Сообщение..."
        />
        <Button title="Отправить" onPress={send} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  list: { flexGrow: 1 },
  bubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});