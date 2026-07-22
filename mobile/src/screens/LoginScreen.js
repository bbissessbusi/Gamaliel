import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MeshBackground from '../components/MeshBackground';
import Logo from '../components/Logo';
import { resendConfirmationEmail } from '../services/supabaseService';
import { colors, fonts } from '../theme';

// OAuth needs Google/Apple client IDs + native config we don't have yet.
// Buttons render (ready for the design) but stay disabled until wired up
// — see mobile/README.md.
const OAUTH_ENABLED = false;

const REMEMBERED_EMAIL_KEY = 'gamaliel_remembered_email';

export default function LoginScreen({ onLogin, onNavigateSignUp, onNavigateForgotPassword }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(REMEMBERED_EMAIL_KEY).then((saved) => {
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    setEmailNotConfirmed(false);
    setResendSuccess(false);
    try {
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      } else {
        await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
      await onLogin(email, password);
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('email_not_confirmed')) {
        setEmailNotConfirmed(true);
        setError(
          "Your email hasn't been confirmed yet. Check your inbox (and spam folder) for the confirmation link, or resend it below."
        );
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    setResendSuccess(false);
    try {
      await resendConfirmationEmail(email);
      setResendSuccess(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to resend confirmation email. Please try again.');
    }
    setResending(false);
  };

  return (
    <View style={styles.screen}>
      <MeshBackground variant="auth" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
                {emailNotConfirmed && (
                  <Pressable
                    onPress={handleResendConfirmation}
                    disabled={resending}
                    style={styles.resendBtn}
                  >
                    <Text style={styles.resendBtnText}>
                      {resending ? 'SENDING...' : 'RESEND CONFIRMATION EMAIL'}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {resendSuccess && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  Confirmation email sent! Check your inbox and click the link, then come back here and log in.
                </Text>
              </View>
            )}

            {OAUTH_ENABLED && (
              <View style={styles.oauthGroup}>
                <Pressable style={styles.oauthBtn}>
                  <Text style={styles.oauthText}>Continue with Google</Text>
                </Pressable>
                <Pressable style={styles.oauthBtn}>
                  <Text style={styles.oauthText}>Continue with Apple</Text>
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
                    autoComplete="current-password"
                  />
                  <Pressable
                    onPress={() => setShowPassword((s) => !s)}
                    style={styles.eyeBtn}
                    hitSlop={8}
                  >
                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.5)" />
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.rememberRow} onPress={() => setRememberMe((r) => !r)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Feather name="check" size={12} color="#fff" />}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </Pressable>

              <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>LOGIN</Text>
                )}
              </Pressable>

              <View style={styles.linksRow}>
                <Pressable onPress={onNavigateForgotPassword} hitSlop={8}>
                  <Text style={styles.linkText}>Forgot Password</Text>
                </Pressable>
                <Pressable onPress={onNavigateSignUp} hitSlop={8}>
                  <Text style={styles.linkText}>Sign Up</Text>
                </Pressable>
              </View>
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
    backgroundColor: 'rgba(255,255,255,0.06)',
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
  resendBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,69,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.4)',
  },
  resendBtnText: { color: colors.orange, fontFamily: fonts.monoBold, fontSize: 10, fontWeight: '700' },
  successBox: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  successText: { color: '#34d399', fontFamily: fonts.monoBold, fontSize: 10, textAlign: 'center', fontWeight: '700' },
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
  form: { width: '100%', marginTop: 24, gap: 20 },
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
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.orange, borderColor: 'transparent' },
  rememberText: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1 },
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
  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  linkText: { color: colors.white, fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.5, minHeight: 44, textAlignVertical: 'center' },
  footer: { alignItems: 'center', marginTop: 32, gap: 8 },
  footerText: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },
  footerTagline: { color: 'rgba(255,255,255,0.25)', fontFamily: fonts.bodyBold, fontSize: 7, letterSpacing: 3, fontWeight: '900' },
});
