import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import GradientText from '../components/GradientText';
import { colors, fonts } from '../theme';

const MOCK_EVALUATION = {
  score: '82.5',
  title: 'Sample Evaluation',
  date: '01 JAN 2026',
  evaluator: { type: 'ai', name: 'Gamaliel' },
  lowestMetric: 'pacing',
  isMock: true,
};

const METRIC_LABELS = {
  relevancy: 'Relevancy', clarity: 'Clarity', connectivity: 'Connectivity',
  precision: 'Precision', call_to_action: 'Call to Action',
  relatability: 'Relatability', pacing: 'Pacing', enthusiasm: 'Enthusiasm', charisma: 'Charisma',
};

const METRIC_COLORS = {
  relevancy: '#FF4500', clarity: '#E03E6B', connectivity: '#C23890',
  precision: '#A432B5', call_to_action: '#8B008B',
  relatability: '#FF6347', pacing: '#D12D6F', enthusiasm: '#B026A3', charisma: '#9400D3',
};

function findLowestMetric(structuralWeight, vocalCadence) {
  const allScores = { ...(structuralWeight || {}), ...(vocalCadence || {}) };
  const keys = Object.keys(allScores);
  if (keys.length === 0) return 'unknown';
  let lowestKey = keys[0];
  for (const k of keys) {
    if (allScores[k] < allScores[lowestKey]) lowestKey = k;
  }
  return lowestKey;
}

function EvaluationCard({ score, title, date, evaluator, lowestMetric, isMock }) {
  const metricColor = METRIC_COLORS[lowestMetric] || colors.orange;
  return (
    <View style={[styles.card, isMock && { opacity: 0.6 }]}>
      {isMock && <Text style={styles.mockTag}>SAMPLE CARD</Text>}
      <Text style={styles.cardEyebrow}>HOMILETIC INDEX</Text>
      <Text style={styles.cardScore}>{score}</Text>
      {lowestMetric && lowestMetric !== 'unknown' && (
        <View style={[styles.metricPill, { borderColor: `${metricColor}4D`, backgroundColor: `${metricColor}22` }]}>
          <Text style={[styles.metricPillText, { color: metricColor }]}>
            Improve: {METRIC_LABELS[lowestMetric] || lowestMetric}
          </Text>
        </View>
      )}
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.cardDate}>{date}</Text>
        <View style={styles.evaluatorRow}>
          <Text style={styles.evaluatorLabel}>Evaluator:</Text>
          {evaluator.type === 'ai' ? (
            <Text style={styles.evaluatorAi}>🤖 {evaluator.name}</Text>
          ) : (
            <Text style={styles.evaluatorHuman}>{evaluator.name}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

function GroupHeader({ metricKey, count }) {
  const color = METRIC_COLORS[metricKey] || colors.orange;
  return (
    <View style={styles.groupHeader}>
      <View style={[styles.groupDot, { backgroundColor: color }]} />
      <Text style={[styles.groupHeaderText, { color }]}>
        Needs Improvement: {METRIC_LABELS[metricKey] || metricKey}
      </Text>
      <Text style={styles.groupCount}>({count})</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { savedEvaluations } = useAppContext();

  const displayEvaluations = savedEvaluations && savedEvaluations.length > 0
    ? savedEvaluations.map((ev) => ({
        score: String(ev.total_score),
        title: ev.sermon_title || 'Untitled Sermon',
        date: new Date(ev.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        evaluator: { type: ev.evaluator_type, name: ev.evaluator_name },
        lowestMetric: findLowestMetric(ev.structural_weight, ev.vocal_cadence),
      }))
    : [MOCK_EVALUATION];

  const hasMock = displayEvaluations.length === 1 && displayEvaluations[0].isMock;
  const grouped = {};
  if (!hasMock) {
    displayEvaluations.forEach((ev) => {
      const key = ev.lowestMetric || 'unknown';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ev);
    });
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader onLogoPress={() => navigation.navigate('Dashboard')} onRightPress={() => navigation.navigate('Dashboard')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <GradientText style={styles.title}>EVALUATION HISTORY</GradientText>
          <Text style={styles.subtitle}>{hasMock ? 'INTERNAL AUDIT' : 'GROUPED BY AREA FOR IMPROVEMENT'}</Text>
        </View>

        {hasMock ? (
          <>
            <Text style={styles.emptyHint}>Complete your first evaluation to see it here</Text>
            <View style={styles.grid}>
              <EvaluationCard {...MOCK_EVALUATION} />
            </View>
          </>
        ) : (
          Object.keys(grouped).map((metricKey) => (
            <View key={metricKey} style={{ marginBottom: 8 }}>
              <GroupHeader metricKey={metricKey} count={grouped[metricKey].length} />
              <View style={styles.grid}>
                {grouped[metricKey].map((ev, i) => (
                  <EvaluationCard key={`${metricKey}-${i}`} {...ev} />
                ))}
              </View>
            </View>
          ))
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 THE SCRIBES INC.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = '48%';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, paddingBottom: 40 },
  titleSection: { alignItems: 'center', paddingVertical: 24 },
  title: { fontFamily: fonts.monoExtraBold, fontSize: 24, fontWeight: '900', letterSpacing: 3, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.mono, fontSize: 9, letterSpacing: 4, marginTop: 10, textTransform: 'uppercase' },
  emptyHint: { color: 'rgba(255,255,255,0.3)', fontFamily: fonts.mono, fontSize: 10, textAlign: 'center', letterSpacing: 1, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  mockTag: { color: 'rgba(255,255,255,0.3)', fontFamily: fonts.mono, fontSize: 7, letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' },
  cardEyebrow: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.mono, fontSize: 9, letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' },
  cardScore: { color: 'rgba(255,255,255,0.95)', fontFamily: fonts.monoExtraBold, fontSize: 34, fontWeight: '900', marginBottom: 8 },
  metricPill: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  metricPillText: { fontFamily: fonts.mono, fontSize: 7, textTransform: 'uppercase', letterSpacing: 1 },
  cardFooter: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', width: '100%', alignItems: 'center' },
  cardTitle: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  cardDate: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.mono, fontSize: 8, marginTop: 2, marginBottom: 8, textTransform: 'uppercase' },
  evaluatorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  evaluatorLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 7, fontFamily: fonts.bodyBold, fontWeight: '700', textTransform: 'uppercase' },
  evaluatorAi: { color: colors.magenta, fontFamily: fonts.mono, fontSize: 10, fontWeight: '700' },
  evaluatorHuman: { color: colors.pink, fontFamily: fonts.script, fontSize: 13 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, marginBottom: 12 },
  groupDot: { width: 8, height: 8, borderRadius: 4 },
  groupHeaderText: { fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  groupCount: { color: 'rgba(255,255,255,0.3)', fontFamily: fonts.mono, fontSize: 8 },
  footer: { paddingTop: 32, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.bodyBold, fontSize: 8, fontWeight: '900', letterSpacing: 3 },
});
