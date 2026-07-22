import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MeshBackground from '../components/MeshBackground';
import Logo from '../components/Logo';
import { colors, fonts } from '../theme';

const OAUTH_ENABLED = false;

export default function SignUpScreen({ onSignUp, onNavigateLogin }) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSignUp(fullName, email, password);
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.screen}>
      <MeshBackground variant="auth" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Logo height={48} />

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {OAUTH_ENABLED && (
              <View style={styles.oauthGroup}>
                <Pressable style={styles.oauthBtn}>
                  <Text style={styles.oauthText}>Sign up with Google</Text>
                </Pressable>
                <Pressable style={styles.oauthBtn}>
                  <Text style={styles.oauthText}>Sign up with Apple</Text>
                </Pressable>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ENTER NAME"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={fullName}
                  onChangeText={setFullName}
                  autoComplete="name"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ENTER EMAIL"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, paddingRight: 44 }]}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                  />
                  <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn} hitSlop={8}>
                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.5)" />
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>CREATE ACCOUNT</Text>
                )}
              </Pressable>

              <Pressable onPress={onNavigateLogin} style={styles.linkCenter} hitSlop={8}>
                <Text style={styles.linkText}>
                  ALREADY HAVE AN ACCOUNT? <Text style={styles.linkAccent}>LOGIN</Text>
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© THE SCRIBES INC.</Text>
            <Text style={styles.footerTagline}>WE FIX WHAT MARKETING CANNOT</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorBox: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    alignItems: 'center',
  },
  errorText: { color: '#f87171', fontFamily: fonts.monoBold, fontSize: 10, textAlign: 'center', fontWeight: '700' },
  oauthGroup: { width: '100%', marginTop: 24 },
  oauthBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    marginBottom: 12,
  },
  oauthText: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 1.5 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(255,255,255,0.3)', fontFamily: fonts.mono, fontSize: 9, textTransform: 'uppercase' },
  form: { width: '100%', marginTop: 24, gap: 18 },
  field: { gap: 8 },
  fieldLabel: { color: 'rgba(255,255,255,0.6)', fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.white,
    fontFamily: fonts.mono,
    fontSize: 15,
    letterSpacing: 1,
  },
  passwordRow: { position: 'relative', justifyContent: 'center' },
  eyeBtn: { position: 'absolute', right: 12, height: 44, width: 32, alignItems: 'center', justifyContent: 'center' },
  submitBtn: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.orange,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  submitText: { color: colors.white, fontFamily: fonts.monoBold, fontSize: 14, letterSpacing: 4, fontWeight: '700' },
  linkCenter: { alignItems: 'center', marginTop: 12, minHeight: 44, justifyContent: 'center' },
  linkText: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.5 },
  linkAccent: { color: colors.orange, textDecorationLine: 'underline' },
  footer: { alignItems: 'center', marginTop: 32, gap: 8 },
  footerText: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },
  footerTagline: { color: 'rgba(255,255,255,0.25)', fontFamily: fonts.bodyBold, fontSize: 7, letterSpacing: 3, fontWeight: '900' },
});
