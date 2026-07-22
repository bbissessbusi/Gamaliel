import React, { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, fonts } from '../theme';

/** Primary CTA button with debossing press effect, matching the web app's GradientButton. */
export default function GradientButton({ children, onPress, small = false, disabled = false, style }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={style}
    >
      <LinearGradient
        colors={pressed ? gradients.brandPressed : gradients.brandButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.base,
          small ? styles.small : styles.large,
          { opacity: disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
        ]}
      >
        <Text style={[styles.label, small ? styles.labelSmall : styles.labelLarge]}>
          {children}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  labelLarge: { fontSize: 12 },
  labelSmall: { fontSize: 9 },
});
