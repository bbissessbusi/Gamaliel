import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, findNodeHandle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import GradientText from '../components/GradientText';
import { colors, fonts } from '../theme';

const SECTIONS = [
  {
    number: 'I', title: 'The Sacred Foundation',
    terms: [
      { id: 'fidelity', title: 'Fidelity', etymology: 'Lat. Fidelitas — Faithfulness', application: "Measures the sermon's unwavering loyalty to the unchanging truth of the Christian faith." },
      { id: 'exegesis', title: 'Exegesis', etymology: 'Gr. Exēgeisthai — To lead out', application: "The preacher's discipline in leading out the inherent meaning from the biblical text, resisting eisegesis." },
      { id: 'gospel-centrality', title: 'Gospel Centrality', etymology: 'The Christological Lens', application: 'Ensures the person and work of Jesus Christ is central and unmistakable in the message, never an afterthought.' },
    ],
  },
  {
    number: 'II', title: 'Message Architecture',
    terms: [
      { id: 'relevancy', title: 'Relevancy', etymology: 'Lat. Relevare — To lift up', application: "Effectively 'lifting up' the ancient text for the modern world, bridging the cultural gap." },
      { id: 'clarity', title: 'Clarity', etymology: 'Lat. Clarus — Bright, distinct', application: "The luminosity of the sermon's core idea. A single, sharp point that can be easily recalled." },
      { id: 'connectivity', title: 'Connectivity', etymology: 'Lat. Connectere — To bind', application: 'The structural integrity of the message; the strength of ligaments binding individual points.' },
      { id: 'precision', title: 'Precision', etymology: 'Lat. Praecisio — A cutting short', application: 'Surgical use of language where every word is intentional, eliminating excess to maximize clarity and impact.' },
      { id: 'call-to-action', title: 'Call to Action', etymology: 'The Imperative Response', application: "The sermon's clear, compelling invitation for listeners to respond — a defined next step that transforms hearing into doing." },
    ],
  },
  {
    number: 'III', title: 'Delivery & Connection',
    terms: [
      { id: 'relatability', title: 'Relatability', etymology: 'Lat. Relatus — Bring back', application: 'Bringing the message to common human ground where the listener feels seen.' },
      { id: 'cadence', title: 'Cadence', etymology: 'Lat. Cadentia — A falling', application: "The musicality and rhythmic rise and fall of the preacher's voice." },
      { id: 'pacing', title: 'Pacing', etymology: 'Lat. Passus — A step', application: 'The deliberate control of delivery speed, strategic pauses, and rhythmic variation that gives weight to key moments.' },
      { id: 'enthusiasm', title: 'Enthusiasm', etymology: 'Gr. Enthousiasmos — Inspired', application: 'Evidence that the preacher is genuinely moved by the truth of the message.' },
      { id: 'charisma', title: 'Charisma', etymology: 'Gr. Kharisma — Gift of grace', application: 'The divine gift of commanding attention and building rapport with an audience.' },
    ],
  },
];

const GlossaryCard = React.forwardRef(function GlossaryCard({ term, highlighted }, ref) {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (highlighted) {
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 1800, useNativeDriver: false }),
      ]).start();
    }
  }, [highlighted, glow]);

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.08)', 'rgba(255,69,0,0.8)'],
  });

  return (
    <Animated.View ref={ref} style={[styles.card, { borderColor }]}>
      <Text style={styles.cardTitle}>{term.title}</Text>
      <Text style={styles.cardEtymology}>{term.etymology}</Text>
      <Text style={styles.cardAppLabel}>APPLICATION</Text>
      <Text style={styles.cardApplication}>{term.application}</Text>
    </Animated.View>
  );
});

export default function GlossaryScreen() {
  const navigation = useNavigation();
  const { glossaryTerm } = useAppContext();
  const scrollRef = useRef(null);
  const cardRefs = useRef({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!glossaryTerm) return;
    const timer = setTimeout(() => {
      const cardNode = cardRefs.current[glossaryTerm];
      const scrollHandle = scrollRef.current && findNodeHandle(scrollRef.current);
      if (cardNode && scrollHandle) {
        cardNode.measureLayout(
          scrollHandle,
          (x, y) => scrollRef.current.scrollTo({ y: Math.max(0, y - 100), animated: true }),
          () => {}
        );
      }
      setScrolled(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [glossaryTerm]);

  return (
    <View style={styles.screen}>
      <ScreenHeader onLogoPress={() => navigation.navigate('Dashboard')} onRightPress={() => navigation.navigate('Dashboard')} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <GradientText style={styles.title}>Refined Lexicon</GradientText>
          <Text style={styles.subtitle}>
            The authoritative glossary of Homiletic Excellence for Scribe Inc. Each term defines a critical dimension of the Sacred Scorecard.
          </Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.number} style={styles.section}>
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionDividerText}>{section.number}. {section.title}</Text>
              <View style={styles.sectionDividerLine} />
            </View>
            <View style={styles.cardGrid}>
              {section.terms.map((term) => (
                <GlossaryCard
                  key={term.id}
                  term={term}
                  highlighted={scrolled && glossaryTerm === term.id}
                  ref={(r) => { cardRefs.current[term.id] = r; }}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 THE SCRIBES INC.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, paddingBottom: 40 },
  titleSection: { alignItems: 'center', paddingVertical: 32 },
  title: { fontFamily: fonts.bodyBold, fontWeight: '900', fontSize: 32, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontFamily: fonts.body, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  section: { marginBottom: 32 },
  sectionDivider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionDividerText: { color: colors.pink, fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '900', letterSpacing: 3, textTransform: 'uppercase' },
  sectionDividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(209,45,111,0.3)' },
  cardGrid: { gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 20,
  },
  cardTitle: { color: '#fff', fontFamily: fonts.bodyBold, fontWeight: '700', fontSize: 15, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
  cardEtymology: { color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontFamily: fonts.body, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  cardAppLabel: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyBold, fontSize: 8, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  cardApplication: { color: '#fff', fontFamily: fonts.body, fontSize: 12, lineHeight: 18, fontWeight: '300' },
  footer: { paddingTop: 24, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.bodyBold, fontSize: 8, fontWeight: '900', letterSpacing: 3 },
});
