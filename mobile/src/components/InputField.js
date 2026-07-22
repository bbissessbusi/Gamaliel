import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

export default function InputField({ label, emoji, placeholder, value, onChangeText, keyboardType, style }) {
  return (
    <View style={[styles.col, style]}>
      <Text style={styles.label}>
        {emoji ? `${emoji} ` : ''}{label}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  col: { flexDirection: 'column', gap: 8 },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 8,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.white,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
});
