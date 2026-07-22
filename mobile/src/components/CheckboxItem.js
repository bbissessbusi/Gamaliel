import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/** Pass/fail checkbox row for the Sacred Foundation section. */
export default function CheckboxItem({ label, subtitle, checked, onToggle, onLabelPress }) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.check}>✅</Text>}
      </View>
      <View style={styles.textCol}>
        {onLabelPress ? (
          <Pressable onPress={onLabelPress} hitSlop={8}>
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  box: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  check: { fontSize: 18 },
  textCol: { flexDirection: 'column', marginLeft: 4 },
  label: {
    fontFamily: fonts.bodyBold,
    fontWeight: '700',
    color: colors.white,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
