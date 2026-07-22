import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, fonts, getSliderColor } from '../theme';

/** 0-10 scoring slider whose track/thumb color interpolates orange → purple. */
export default function SpectrumSlider({ label, value, onChange, onLabelPress }) {
  const color = getSliderColor(value);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onLabelPress ? (
          <Pressable onPress={onLabelPress}>
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
        <Text style={[styles.value, { color }]}>{String(value).padStart(2, '0')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={color}
        maximumTrackTintColor="rgba(255,255,255,0.1)"
        thumbTintColor={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.white,
  },
  value: {
    fontFamily: fonts.monoExtraBold,
    fontSize: 10,
    fontWeight: '900',
  },
  slider: {
    width: '100%',
    height: 32,
  },
});
