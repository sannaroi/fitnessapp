import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Statics() {
  return (
    <View style={styles.container}>
      <Text>Statics</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

