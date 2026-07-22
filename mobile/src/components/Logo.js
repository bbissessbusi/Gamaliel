import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

const logoSrc = require('../assets/logo.png');

export default function Logo({ height = 28, showLabel = false, onPress }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={styles.row}>
      <Image source={logoSrc} style={{ height, width: height, resizeMode: 'contain' }} />
      {showLabel && <Text style={styles.label}>GAMALIEL</Text>}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  label: { fontSize: 8, fontWeight: '900', letterSpacing: 2, color: 'rgba(255,255,255,0.6)' },
});
