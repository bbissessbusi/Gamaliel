import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GradientText from './GradientText';
import { fonts } from '../theme';

export default function SectionHeader({ number, emoji, title }) {
  return (
    <View style={styles.row}>
      {number ? <Text style={styles.number}>{number}</Text> : null}
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <GradientText style={styles.title}>{title}</GradientText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  number: { fontSize: 18, fontWeight: '900', fontStyle: 'italic', color: '#fff' },
  emoji: { fontSize: 18 },
  title: {
    fontFamily: fonts.bodyBold,
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
});
