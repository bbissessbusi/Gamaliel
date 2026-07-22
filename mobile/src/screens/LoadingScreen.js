import React from 'react';
import { View, StyleSheet } from 'react-native';
import MeshBackground from '../components/MeshBackground';
import Logo from '../components/Logo';

export default function LoadingScreen() {
  return (
    <View style={styles.screen}>
      <MeshBackground variant="auth" />
      <Logo height={48} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
