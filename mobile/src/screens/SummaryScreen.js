import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import GradientText from '../components/GradientText';
import { colors, fonts } from '../theme';

function getScoreTheme(score) {
  if (score >= 80) return { color: colors.purple, emoji: '👑' };
  if (score >= 50) return { color: colors.pink, emoji: '' };
  return { color: colors.orange, emoji: '' };
}

function ScoreCircle({ score, maxScore = 90 }) {
  const theme = getScoreTheme(score);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }).start();
  }, [opacity]);

  return (
    <View style={styles.scoreCircle}>
      <Animated.View style={{ opacity, alignItems: 'center' }}>
        <Text style={styles.scoreCaption}>FINAL TALLY</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          {!!theme.emoji && <Text style={{ fontSize: 28 }}>{theme.emoji}</Text>}
          <Text style={styles.scoreValue}>
            {score}
            <Text style={{ color: `${theme.color}99` }}>/</Text>
            {maxScore}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

function ScoreBar({ label, score, maxScore = 10 }) {
  const pct = (score / maxScore) * 100;
  return (
    <View style={{ gap: 8 }}>
      <View style={styles.scoreBarRow}>
        <Text style={styles.scoreBarLabel}>{label}</Text>
        <Text style={styles.scoreBarValue}>{String(score).padStart(2, '0')}/{maxScore}</Text>
      </View>
      <View style={styles.scoreBarTrack}>
        <View style={[styles.scoreBarFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

function FoundationItem({ label, checked }) {
  return (
    <View style={styles.foundationRow}>
      <Text style={{ fontSize: 13 }}>{checked ? '✅' : '❌'}</Text>
      <Text style={styles.foundationLabel}>{label}</Text>
    </View>
  );
}

function PostAnalysisCard({ emoji, label, color, content }) {
  return (
    <GlassCard borderRadius={28} style={{ flex: 1 }}>
      <View style={styles.postCardPad}>
        <Text style={[styles.postCardLabel, { color }]}>{emoji} {label}</Text>
        <Text style={styles.postCardContent}>{content}</Text>
      </View>
    </GlassCard>
  );
}

export default function SummaryScreen() {
  const navigation = useNavigation();
  const {
    totalScore, sacredFoundation, structuralWeight, vocalCadence, postAnalysis,
    evaluatorType, evaluatorName, resetScorecard,
  } = useAppContext();

  const evaluatorLabel = evaluatorType === 'ai' ? 'Gamaliel' : evaluatorName;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        onLogoPress={() => navigation.navigate('Dashboard')}
        rightText="HOME"
        onRightPress={() => navigation.navigate('Dashboard')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>EVALUATION SUMMARY</Text>
          <ScoreCircle score={totalScore} />
          {!!evaluatorLabel && (
            <View style={styles.evaluatorRow}>
              <Text style={styles.evaluatorLabel}>Evaluator:</Text>
              {evaluatorType === 'ai' ? (
                <GradientText colors={[colors.pink, colors.magenta]} style={styles.evaluatorNameAi}>{evaluatorLabel}</GradientText>
              ) : (
                <Text style={styles.evaluatorNameHuman}>{evaluatorLabel}</Text>
              )}
            </View>
          )}
        </View>

        <GlassCard borderRadius={40} style={{ marginBottom: 24 }}>
          <View style={styles.breakdownPad}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownHeading}>Sacred Foundation</Text>
              <FoundationItem label="Theological Fidelity" checked={sacredFoundation.theological_fidelity} />
              <FoundationItem label="Exegetical Soundness" checked={sacredFoundation.exegetical_soundness} />
              <FoundationItem label="Gospel Centrality" checked={sacredFoundation.gospel_centrality} />
            </View>

            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownHeading}>Structural Weight</Text>
              <ScoreBar label="Clarity" score={structuralWeight.clarity} />
              <ScoreBar label="Relevancy" score={structuralWeight.relevancy} />
              <ScoreBar label="Connectivity" score={structuralWeight.connectivity} />
              <ScoreBar label="Precision" score={structuralWeight.precision} />
              <ScoreBar label="Call to Action" score={structuralWeight.call_to_action} />
            </View>

            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownHeading}>Vocal Cadence</Text>
              <ScoreBar label="Relatability" score={vocalCadence.relatability} />
              <ScoreBar label="Pacing" score={vocalCadence.pacing} />
              <ScoreBar label="Enthusiasm" score={vocalCadence.enthusiasm} />
              <ScoreBar label="Charisma" score={vocalCadence.charisma} />
            </View>
          </View>
        </GlassCard>

        <Text style={styles.postHeading}>Post-Evaluation Analysis</Text>
        <View style={styles.postGrid}>
          <PostAnalysisCard emoji="⚡" label="Prime Resonance" color={colors.orange} content={postAnalysis.anchoring_point || 'No anchoring point recorded.'} />
          <PostAnalysisCard emoji="📉" label="Structural Drift" color={colors.pink} content={postAnalysis.structural_drift || 'No structural drift identified.'} />
          <PostAnalysisCard emoji="✅" label="Measurable Step" color={colors.purple} content={postAnalysis.measurable_step || 'No measurable step recorded.'} />
        </View>

        <View style={styles.newEvalWrap}>
          <GradientButton
            onPress={() => {
              resetScorecard();
              navigation.navigate('Dashboard');
            }}
          >
            Start a New Evaluation
          </GradientButton>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 THE SCRIBES INC.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginBottom: 32, gap: 20 },
  eyebrow: { color: colors.orange, fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '700', letterSpacing: 6 },
  scoreCircle: {
    width: 220, height: 220, borderRadius: 110,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreCaption: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 8 },
  scoreValue: { color: '#fff', fontFamily: fonts.monoExtraBold, fontSize: 48, fontWeight: '900' },
  evaluatorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  evaluatorLabel: { color: 'rgba(255,255,255,0.3)', fontFamily: fonts.bodyBold, fontSize: 8, fontWeight: '700' },
  evaluatorNameAi: { fontFamily: fonts.mono, fontSize: 13, fontWeight: '700' },
  evaluatorNameHuman: { fontFamily: fonts.script, fontSize: 18, color: colors.pink },
  breakdownPad: { padding: 20, gap: 28 },
  breakdownCol: { gap: 16 },
  breakdownHeading: { color: colors.purple, fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '900', letterSpacing: 3, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 10 },
  foundationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  foundationLabel: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  scoreBarRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreBarLabel: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.bodyBold, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  scoreBarValue: { color: colors.orange, fontFamily: fonts.mono, fontSize: 9 },
  scoreBarTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  scoreBarFill: { height: '100%', backgroundColor: colors.orange, borderRadius: 2 },
  postHeading: { color: 'rgba(255,255,255,0.3)', fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '900', letterSpacing: 4, textAlign: 'center', textTransform: 'uppercase', marginBottom: 16 },
  postGrid: { gap: 12, marginBottom: 24 },
  postCardPad: { padding: 20, gap: 12 },
  postCardLabel: { fontFamily: fonts.bodyBold, fontSize: 9, fontWeight: '900', letterSpacing: 3, textTransform: 'uppercase' },
  postCardContent: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18 },
  newEvalWrap: { alignItems: 'center', paddingVertical: 8 },
  footer: { paddingTop: 32, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.bodyBold, fontSize: 8, fontWeight: '900', letterSpacing: 3 },
});
