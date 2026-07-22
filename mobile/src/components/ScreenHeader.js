import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from './Logo';
import { colors, fonts } from '../theme';

/** Sticky header with logo (left) and a back/skip pill button (right), used by
 * History, Glossary, Summary, and Tour screens. */
export default function ScreenHeader({ onLogoPress, rightLabel = '⬅️', onRightPress, rightText }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Logo height={28} onPress={onLogoPress} />
      <Pressable onPress={onRightPress} style={styles.backBtn}>
        <Text style={styles.backLabel}>{rightText ? rightText : rightLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    color: colors.white,
    fontFamily: fonts.monoBold,
    fontSize: 10,
    fontWeight: '700',
  },
});
