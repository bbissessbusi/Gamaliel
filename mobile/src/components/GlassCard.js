import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../theme';

/**
 * Frosted glass card with a soft gradient border, matching the web app's
 * GlassCard (backdrop-filter blur + gradient border via mask-composite).
 * RN has no CSS mask-composite, so the border is simulated with a
 * gradient-filled outer wrapper padded by `borderWidth`.
 */
export default function GlassCard({ children, style, borderRadius = 32, isCircle = false, intensity = 40 }) {
  const radius = isCircle ? 999 : borderRadius;
  return (
    <LinearGradient
      colors={gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: radius, padding: 1, opacity: 1 }, style]}
    >
      <BlurView intensity={intensity} tint="dark" style={[styles.inner, { borderRadius: radius - 1 }]}>
        <View style={[styles.overlay, { borderRadius: radius - 1 }]}>{children}</View>
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: {
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
});
