import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatBubble({ message, isMine }) {
  return (
    <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
      <Text style={styles.text}>{message.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  text: {
    fontSize: 16,
  },
});
