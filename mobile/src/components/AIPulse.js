import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { colors } from '../theme';

/** Pulsing neon-green dot indicating the AI assistant is active/ready. */
export default function AIPulse() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.green,
        transform: [{ scale }],
        shadowColor: colors.green,
        shadowOpacity: 0.6,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
      }}
    />
  );
}
