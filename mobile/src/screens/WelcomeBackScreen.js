import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import MeshBackground from '../components/MeshBackground';
import Logo from '../components/Logo';
import GradientText from '../components/GradientText';
import { colors, fonts } from '../theme';

export default function WelcomeBackScreen() {
  const navigation = useNavigation();
  const { setAuthStatus, consumeIsNewSignUp } = useAppContext();

  const proceed = React.useCallback(() => {
    const wasNewSignUp = consumeIsNewSignUp();
    setAuthStatus('signedIn');
    // Defer navigation one tick so the signedIn stack is mounted first.
    setTimeout(() => {
      if (wasNewSignUp) navigation.navigate('Tour');
    }, 0);
  }, [consumeIsNewSignUp, setAuthStatus, navigation]);

  useEffect(() => {
    const timer = setTimeout(proceed, 3000);
    return () => clearTimeout(timer);
  }, [proceed]);

  return (
    <View style={styles.screen}>
      <MeshBackground variant="auth" />
      <Logo height={56} />
      <GradientText style={styles.title}>Welcome Back</GradientText>
      <Text style={styles.subtitle}>Your scorecard is ready. Let's continue refining your craft.</Text>
      <ActivityIndicator color={colors.orange} style={{ marginTop: 24 }} />
      <Text style={styles.loadingLabel}>LOADING YOUR DATA...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontFamily: fonts.bodyBold, fontWeight: '900', fontSize: 32, textTransform: 'uppercase', marginTop: 24, marginBottom: 12, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', maxWidth: 320, fontWeight: '300' },
  loadingLabel: { color: 'rgba(255,255,255,0.25)', fontFamily: fonts.mono, fontSize: 9, letterSpacing: 3, marginTop: 20 },
});
