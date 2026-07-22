import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

/**
 * Approximates the web app's multi radial-gradient backgrounds
 * (React Native's LinearGradient has no radial mode) using layered
 * diagonal gradients glowing from the corners over the dark base.
 */
export default function MeshBackground({ variant = 'default' }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />
      <LinearGradient
        colors={['rgba(255,69,0,0.16)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(139,0,139,0.18)']}
        start={{ x: 0.4, y: 0.4 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {variant === 'auth' && (
        <LinearGradient
          colors={['transparent', 'rgba(0,56,255,0.08)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
}
