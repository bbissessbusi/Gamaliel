import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SummaryScreen from '../screens/SummaryScreen';
import HistoryScreen from '../screens/HistoryScreen';
import GlossaryScreen from '../screens/GlossaryScreen';
import TourScreen from '../screens/TourScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'fade',
  contentStyle: { backgroundColor: colors.bg },
};

function LoginScreenContainer() {
  const navigation = useNavigation();
  const { handleLogin } = useAppContext();
  return (
    <LoginScreen
      onLogin={handleLogin}
      onNavigateSignUp={() => navigation.navigate('SignUp')}
      onNavigateForgotPassword={() => {}}
    />
  );
}

function SignUpScreenContainer() {
  const navigation = useNavigation();
  const { handleSignUp } = useAppContext();
  return (
    <SignUpScreen
      onSignUp={handleSignUp}
      onNavigateLogin={() => navigation.navigate('Login')}
    />
  );
}

export default function RootNavigator() {
  const { authStatus } = useAppContext();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {authStatus === 'loading' && (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      )}
      {authStatus === 'signedOut' && (
        <>
          <Stack.Screen name="Login" component={LoginScreenContainer} />
          <Stack.Screen name="SignUp" component={SignUpScreenContainer} />
        </>
      )}
      {authStatus === 'welcome' && (
        <Stack.Screen name="WelcomeBack" component={WelcomeBackScreen} />
      )}
      {authStatus === 'signedIn' && (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Summary" component={SummaryScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Glossary" component={GlossaryScreen} />
          <Stack.Screen name="Tour" component={TourScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
