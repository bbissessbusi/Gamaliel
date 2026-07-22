import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../components/GlassCard';
import GradientText from '../components/GradientText';
import Logo from '../components/Logo';
import { colors, fonts } from '../theme';

const TOUR_STEPS = [
  { id: 'dashboard', title: 'The Scorecard', subtitle: 'Your Command Center', icon: '📋', description: 'Enter sermon details — title, date, and primary goal. This is where every evaluation begins.' },
  { id: 'capture', title: 'Digital Capture', subtitle: 'AI-Powered Analysis', icon: '📹', description: 'Upload your sermon recording. Gamaliel AI transcribes it, then scores your delivery across every metric automatically.' },
  { id: 'scoring', title: 'Scoring Framework', subtitle: 'Three Pillars of Excellence', icon: '📊', description: 'Sacred Foundation (pass/fail checkboxes), Structural Weight (0-10 sliders), and Vocal Cadence (0-10 sliders) combine into your Composite Homiletics Index out of 90.' },
  { id: 'lexicon', title: 'Refined Lexicon', subtitle: 'The Language of Preaching', icon: '📖', description: 'Every scoring term is defined with its etymology and application. Tap any term label on the scorecard to jump directly to its definition in the glossary.' },
  { id: 'history', title: 'Evaluation History', subtitle: 'Track Your Growth', icon: '📈', description: 'Every completed evaluation is saved to your account. Review past scores, compare progress over time, and see how your preaching evolves.' },
  { id: 'summary', title: 'Score Summary', subtitle: 'Your Final Report', icon: '🏆', description: 'After calculating your score, see a beautiful breakdown of every metric with your Composite Homiletics Index, evaluator signature, and post-analysis insights.' },
];

export default function TourScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const current = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  const goBack = () => navigation.navigate('Dashboard');

  const handleNext = () => {
    if (isLast) goBack();
    else setStep((s) => s + 1);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Logo height={28} onPress={() => navigation.navigate('Dashboard')} />
        <Pressable onPress={goBack} style={styles.skipBtn}>
          <Text style={styles.skipText}>SKIP TOUR</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dotsRow}>
          {TOUR_STEPS.map((s, i) => (
            <Pressable key={s.id} onPress={() => setStep(i)} style={styles.dotTouch}>
              <View
                style={[
                  styles.dot,
                  i === step && styles.dotActive,
                  i < step && styles.dotDone,
                ]}
              />
            </Pressable>
          ))}
        </View>

        <GradientText style={styles.stepCounter}>STEP {step + 1} OF {TOUR_STEPS.length}</GradientText>

        <View style={styles.stepHeader}>
          <Text style={styles.stepIcon}>{current.icon}</Text>
          <GradientText style={styles.stepTitle}>{current.title}</GradientText>
          <Text style={styles.stepSubtitle}>{current.subtitle}</Text>
        </View>

        <Text style={styles.stepDescription}>{current.description}</Text>

        <GlassCard borderRadius={32} style={{ marginBottom: 32 }}>
          <View style={styles.previewPad}>
            <Text style={styles.previewPlaceholder}>{current.icon}  {current.title} preview</Text>
          </View>
        </GlassCard>

        <View style={styles.navRow}>
          <Pressable
            onPress={() => !isFirst && setStep((s) => s - 1)}
            disabled={isFirst}
            style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
          >
            <Text style={[styles.navBtnText, isFirst && { color: 'rgba(255,255,255,0.2)' }]}>⬅️ Back</Text>
          </Pressable>

          <Pressable onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>{isLast ? 'Start Using App 🚀' : 'Next ➡️'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  skipBtn: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  skipText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 9, fontWeight: '700', letterSpacing: 1.5 },
  content: { padding: 20 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 },
  dotTouch: { padding: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotActive: { width: 24, backgroundColor: colors.orange },
  dotDone: { backgroundColor: 'rgba(255,69,0,0.4)' },
  stepCounter: { fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '900', letterSpacing: 5, textAlign: 'center', marginBottom: 20 },
  stepHeader: { alignItems: 'center', marginBottom: 20 },
  stepIcon: { fontSize: 40, marginBottom: 12 },
  stepTitle: { fontFamily: fonts.bodyBold, fontWeight: '900', fontSize: 26, textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' },
  stepSubtitle: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase' },
  stepDescription: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24, fontWeight: '300' },
  previewPad: { padding: 32, alignItems: 'center' },
  previewPlaceholder: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.mono, fontSize: 12, textAlign: 'center' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  navBtnDisabled: { backgroundColor: 'transparent', borderColor: 'transparent' },
  navBtnText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  nextBtn: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.orange },
  nextBtnText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
});
