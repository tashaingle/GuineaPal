import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import authService from '@/services/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      // Auth context will handle navigation
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const checkRegisteredAccounts = async () => {
    try {
      const users = await authService.getMockUsers();
      if (users.length === 0) {
        Alert.alert('Info', 'No accounts are registered on this device. Please create an account first.');
      } else {
        Alert.alert('Registered Accounts', 
          users.map(user => `Email: ${user.email}`).join('\n'),
          [
            { 
              text: 'OK',
              style: 'cancel'
            },
            {
              text: 'Reset Data',
              style: 'destructive',
              onPress: async () => {
                try {
                  await authService.resetAuthData();
                  Alert.alert('Success', 'Auth data has been reset. You can now create a new account.');
                } catch (error) {
                  Alert.alert('Error', 'Failed to reset auth data.');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check registered accounts.');
    }
  };

  // Calculate dynamic padding based on screen size
  const dynamicPadding = Math.min(width, height) * 0.06;
  const headerPadding = Math.min(width, height) * 0.04;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { padding: headerPadding }]}>
          <Text style={[styles.title, { fontSize: Math.min(28, width * 0.07) }]}>
            Welcome to GuineaPal
          </Text>
          <Text style={[styles.subtitle, { fontSize: Math.min(16, width * 0.04) }]}>
            Sign in to sync your data across devices
          </Text>
        </View>

        <View style={[styles.form, { padding: dynamicPadding }]}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="email" color="#5D4037" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" color="#5D4037" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                color="#5D4037"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
          >
            Sign In
          </Button>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Create an Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.registerButton, { marginTop: 16, borderStyle: 'dashed' }]}
            onPress={checkRegisteredAccounts}
          >
            <Text style={[styles.registerButtonText, { fontSize: 14 }]}>Check Registered Accounts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#795548',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: '#5D4037',
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#5D4037',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#9E9E9E',
    paddingHorizontal: 16,
  },
  registerButton: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#5D4037',
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#5D4037',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen; 