import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import GradientText from '../components/GradientText';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import SectionHeader from '../components/SectionHeader';
import CheckboxItem from '../components/CheckboxItem';
import SpectrumSlider from '../components/SpectrumSlider';
import PillContainer from '../components/PillContainer';
import AIPulse from '../components/AIPulse';
import { colors, fonts } from '../theme';

const SERMON_MEDIA_TYPES = [
  'audio/*',
  'video/*',
  'public.audio',
  'public.movie',
];

function NavLink({ label, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.navLink}>
      <Text style={styles.navLinkText}>{label}</Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    handleLogout,
    loadEvaluations,
    navigateToGlossary,
    sermonTitle, setSermonTitle,
    preachDate, setPreachDate,
    primaryGoal, setPrimaryGoal,
    sacredFoundation, setSacredFoundation,
    structuralWeight, setStructuralWeight,
    vocalCadence, setVocalCadence,
    postAnalysis, setPostAnalysis,
    evaluatorType, setEvaluatorType,
    evaluatorName, setEvaluatorName,
    totalScore,
    isAnalyzing, analysisStatus, analysisMilestone,
    recordedFile, setRecordedFile,
    runAnalysis,
    handleSave,
    saveCurrentEvaluation,
  } = useAppContext();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const openGlossary = (termKey) => {
    navigateToGlossary(termKey);
    navigation.navigate('Glossary');
  };

  const pickFile = async () => {
    if (isAnalyzing) return;
    if (recordedFile) {
      runAnalysis(recordedFile);
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({
      type: SERMON_MEDIA_TYPES,
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) return;
    const file = result.assets[0];
    setRecordedFile(file);
    runAnalysis(file);
  };

  const handleCalculateScore = async () => {
    await saveCurrentEvaluation();
    navigation.navigate('Summary');
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().slice(0, 10);
      setPreachDate(iso);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Logo height={28} onPress={() => navigation.navigate('Dashboard')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navRow}>
          <NavLink label="TOUR" onPress={() => navigation.navigate('Tour')} />
          <NavLink label="HISTORY" onPress={() => { loadEvaluations(); navigation.navigate('History'); }} />
          <NavLink label="LEXICON" onPress={() => openGlossary()} />
          <Pressable onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>SAVE</Text>
          </Pressable>
          <NavLink label="LOGOUT" onPress={handleLogout} />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.hero}>
          <GradientText style={styles.heroTitle}>SCORECARD</GradientText>
          <Text style={styles.heroSubtitle}>
            Premium digital analysis of sermon weight, structure, and delivery. Designed for intentional preachers.
          </Text>
        </View>

        <GlassCard style={styles.section} borderRadius={32}>
          <View style={styles.cardPad}>
            <InputField label="Sermon Title/Text" emoji="📖" placeholder="e.g. Romans 8:1-4" value={sermonTitle} onChangeText={setSermonTitle} />
            <View style={{ height: 16 }} />
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <InputField label="Preach Date" emoji="📅" placeholder="YYYY-MM-DD" value={preachDate} />
              </View>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={preachDate ? new Date(preachDate) : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <View style={{ height: 16 }} />
            <InputField label="Primary Goal" emoji="🎯" placeholder="The core objective" value={primaryGoal} onChangeText={setPrimaryGoal} />
          </View>
        </GlassCard>

        <View style={styles.section}>
          <SectionHeader emoji="📹" title="Digital Capture" />
          <GlassCard borderRadius={32}>
            <View style={styles.cardPad}>
              <GradientText style={styles.captureTitle}>Sermon Recording</GradientText>
              <Text style={styles.captureDesc}>
                Upload your sermon recording (max 60 min). Gamaliel AI will transcribe and analyze automatically.
              </Text>

              {recordedFile && !isAnalyzing && (
                <View style={styles.fileRow}>
                  <Text style={styles.fileName} numberOfLines={1}>📁 {recordedFile.name}</Text>
                  <Pressable onPress={() => setRecordedFile(null)} style={styles.removeFileBtn}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)' }}>✕</Text>
                  </Pressable>
                </View>
              )}

              {isAnalyzing && (
                <View style={styles.analyzingBox}>
                  <View style={styles.analyzingRow}>
                    <ActivityIndicator color={colors.green} size="small" />
                    <Text style={styles.analyzingStatus}>{analysisStatus}</Text>
                  </View>
                  {!!analysisMilestone && <Text style={styles.analyzingMilestone}>{analysisMilestone}</Text>}
                </View>
              )}

              <PillContainer style={styles.aiPill} onPress={pickFile}>
                <View style={styles.aiPillRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aiPillLabel}>🤖 GAMALIEL AI ASSISTANT</Text>
                    <Text style={styles.aiPillValue}>{isAnalyzing ? 'ANALYZING...' : 'START AI ANALYSIS'}</Text>
                  </View>
                  <AIPulse />
                </View>
              </PillContainer>
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <SectionHeader number="1️⃣" title="Sacred Foundation" />
          <GlassCard borderRadius={32}>
            <View style={[styles.cardPad, styles.checkboxGrid]}>
              <CheckboxItem
                label="Theological Fidelity" subtitle="Doctrinal accuracy"
                checked={sacredFoundation.theological_fidelity}
                onToggle={() => setSacredFoundation((p) => ({ ...p, theological_fidelity: !p.theological_fidelity }))}
                onLabelPress={() => openGlossary('theological_fidelity')}
              />
              <CheckboxItem
                label="Exegetical Soundness" subtitle="Contextual integrity"
                checked={sacredFoundation.exegetical_soundness}
                onToggle={() => setSacredFoundation((p) => ({ ...p, exegetical_soundness: !p.exegetical_soundness }))}
                onLabelPress={() => openGlossary('exegetical_soundness')}
              />
              <CheckboxItem
                label="Gospel Centrality" subtitle="Christ-focused"
                checked={sacredFoundation.gospel_centrality}
                onToggle={() => setSacredFoundation((p) => ({ ...p, gospel_centrality: !p.gospel_centrality }))}
                onLabelPress={() => openGlossary('gospel_centrality')}
              />
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <SectionHeader number="2️⃣" title="Structural Weight" />
          <GlassCard borderRadius={32}>
            <View style={styles.cardPad}>
              <SpectrumSlider label="Relevancy" value={structuralWeight.relevancy} onChange={(v) => setStructuralWeight((p) => ({ ...p, relevancy: v }))} onLabelPress={() => openGlossary('relevancy')} />
              <SpectrumSlider label="Clarity" value={structuralWeight.clarity} onChange={(v) => setStructuralWeight((p) => ({ ...p, clarity: v }))} onLabelPress={() => openGlossary('clarity')} />
              <SpectrumSlider label="Connectivity" value={structuralWeight.connectivity} onChange={(v) => setStructuralWeight((p) => ({ ...p, connectivity: v }))} onLabelPress={() => openGlossary('connectivity')} />
              <SpectrumSlider label="Precision" value={structuralWeight.precision} onChange={(v) => setStructuralWeight((p) => ({ ...p, precision: v }))} onLabelPress={() => openGlossary('precision')} />
              <SpectrumSlider label="Call to Action" value={structuralWeight.call_to_action} onChange={(v) => setStructuralWeight((p) => ({ ...p, call_to_action: v }))} onLabelPress={() => openGlossary('call_to_action')} />
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <SectionHeader number="3️⃣" title="Vocal Cadence" />
          <GlassCard borderRadius={32}>
            <View style={styles.cardPad}>
              <SpectrumSlider label="Relatability" value={vocalCadence.relatability} onChange={(v) => setVocalCadence((p) => ({ ...p, relatability: v }))} onLabelPress={() => openGlossary('relatability')} />
              <SpectrumSlider label="Pacing" value={vocalCadence.pacing} onChange={(v) => setVocalCadence((p) => ({ ...p, pacing: v }))} onLabelPress={() => openGlossary('pacing')} />
              <SpectrumSlider label="Enthusiasm" value={vocalCadence.enthusiasm} onChange={(v) => setVocalCadence((p) => ({ ...p, enthusiasm: v }))} onLabelPress={() => openGlossary('enthusiasm')} />
              <SpectrumSlider label="Charisma" value={vocalCadence.charisma} onChange={(v) => setVocalCadence((p) => ({ ...p, charisma: v }))} onLabelPress={() => openGlossary('charisma')} />
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <GradientText style={styles.postTitle}>CRITICAL POST-ANALYSIS</GradientText>
          {[
            { emoji: '⚡', label: 'Anchoring Point', key: 'anchoring_point', placeholder: 'Most impactful segment...' },
            { emoji: '📉', label: 'Structural Drift', key: 'structural_drift', placeholder: 'Loss of focus area...' },
            { emoji: '✅', label: 'Measurable Step', key: 'measurable_step', placeholder: 'Improvement task...' },
          ].map((item) => (
            <GlassCard key={item.key} borderRadius={28} style={{ marginBottom: 12 }}>
              <View style={styles.cardPadSm}>
                <Text style={styles.postLabel}>{item.emoji} {item.label}</Text>
                <TextInput
                  style={styles.postInput}
                  placeholder={item.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={postAnalysis[item.key]}
                  onChangeText={(t) => setPostAnalysis((p) => ({ ...p, [item.key]: t }))}
                  multiline
                />
              </View>
            </GlassCard>
          ))}
        </View>

        <View style={styles.calculateSection}>
          <GradientButton onPress={handleCalculateScore} disabled={totalScore === 0}>
            CALCULATE SCORE
          </GradientButton>

          <GlassCard borderRadius={32} style={{ marginTop: 32, width: '100%' }}>
            <View style={styles.cardPad}>
              <Text style={styles.evalSigLabel}>EVALUATOR SIGNATURE</Text>
              <View style={styles.evalToggleRow}>
                <Pressable
                  onPress={() => { setEvaluatorType('human'); setEvaluatorName(''); }}
                  style={[styles.evalToggle, evaluatorType === 'human' && styles.evalToggleActive]}
                >
                  <Text style={styles.evalToggleText}>✍️ Human</Text>
                </Pressable>
                <Pressable
                  onPress={() => { setEvaluatorType('ai'); setEvaluatorName('Gamaliel'); }}
                  style={[styles.evalToggle, evaluatorType === 'ai' && styles.evalToggleActiveAI]}
                >
                  <Text style={[styles.evalToggleText, evaluatorType === 'ai' && { color: colors.green }]}>🤖 AI Gamaliel</Text>
                </Pressable>
              </View>
              {evaluatorType === 'human' ? (
                <TextInput
                  style={styles.evalNameInput}
                  placeholder="Enter evaluator name..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={evaluatorName}
                  onChangeText={setEvaluatorName}
                />
              ) : (
                <View style={styles.evalAiRow}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                  <GradientText colors={[colors.pink, colors.magenta]} style={styles.evalAiName}>Gamaliel</GradientText>
                </View>
              )}
            </View>
          </GlassCard>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(7,3,4,0.9)',
  },
  navRow: { flexGrow: 0, marginLeft: 8 },
  navLink: { paddingHorizontal: 8, paddingVertical: 10, justifyContent: 'center' },
  navLinkText: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  saveBtn: { backgroundColor: colors.orange, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, justifyContent: 'center', marginHorizontal: 4 },
  saveBtnText: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  content: { padding: 16 },
  hero: { marginBottom: 24 },
  heroTitle: { fontSize: 40, fontFamily: fonts.bodyBold, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -1, marginBottom: 8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: fonts.body, lineHeight: 20 },
  section: { marginBottom: 20 },
  cardPad: { paddingHorizontal: 20, paddingVertical: 20 },
  cardPadSm: { paddingHorizontal: 20, paddingVertical: 16 },
  captureTitle: { fontSize: 14, fontFamily: fonts.bodyBold, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  captureDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 11, lineHeight: 16, marginBottom: 16 },
  fileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  fileName: { color: 'rgba(255,255,255,0.6)', fontFamily: fonts.mono, fontSize: 10, flex: 1, marginRight: 8 },
  removeFileBtn: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  analyzingBox: { backgroundColor: 'rgba(57,255,20,0.1)', borderWidth: 1, borderColor: 'rgba(57,255,20,0.3)', borderRadius: 12, padding: 12, marginBottom: 12, gap: 8 },
  analyzingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  analyzingStatus: { color: colors.green, fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '700', flexShrink: 1 },
  analyzingMilestone: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.mono, fontSize: 9, fontStyle: 'italic', paddingLeft: 26, lineHeight: 14 },
  aiPill: { paddingHorizontal: 16, paddingVertical: 14 },
  aiPillRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiPillLabel: { color: colors.green, fontFamily: fonts.monoBold, fontSize: 8, fontWeight: '700', letterSpacing: 1.5 },
  aiPillValue: { color: '#fff', fontFamily: fonts.monoBold, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginTop: 4 },
  checkboxGrid: { gap: 16 },
  postTitle: { fontSize: 15, fontFamily: fonts.bodyBold, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center', marginBottom: 16, fontStyle: 'italic' },
  postLabel: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 9, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  postInput: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.mono, fontSize: 12, minHeight: 70, textAlignVertical: 'top' },
  calculateSection: { alignItems: 'center', paddingVertical: 24 },
  evalSigLabel: { color: '#fff', fontFamily: fonts.bodyBold, fontSize: 8, fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginBottom: 16, textTransform: 'uppercase' },
  evalToggleRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 16 },
  evalToggle: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  evalToggleActive: { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' },
  evalToggleActiveAI: { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(57,255,20,0.3)' },
  evalToggleText: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.bodyBold, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  evalNameInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontFamily: fonts.script, fontSize: 18, textAlign: 'center' },
  evalAiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8 },
  evalAiName: { fontFamily: fonts.mono, fontSize: 16, fontWeight: '700' },
  footer: { paddingTop: 24, paddingBottom: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', marginTop: 8 },
  footerText: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyBold, fontSize: 8, fontWeight: '900', letterSpacing: 3 },
});
