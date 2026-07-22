import React from 'react';
import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme';

/** Gradient-filled text, matching the web app's ubiquitous orange→pink→purple headers. */
export default function GradientText({
  children,
  style,
  colors = gradients.brand,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) {
  return (
    <MaskedView maskElement={<Text style={[style, { backgroundColor: 'transparent' }]}>{children}</Text>}>
      <LinearGradient colors={colors} start={start} end={end}>
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}
