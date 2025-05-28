import CustomSplash from '@/components/CustomSplash';
import { AuthProvider } from '@/contexts/AuthContext';
import { PetProvider } from '@/contexts/PetContext';
import AppNavigator from '@/navigation/AppNavigator';
import colors from '@/theme/colors';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

// Prevent the default splash screen behavior
SplashScreen.preventAutoHideAsync()
  .catch(() => console.warn('Error preventing splash screen auto-hide'));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  }
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Hide the native splash screen immediately
        await SplashScreen.hideAsync();
        // Add any initialization tasks here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Show custom splash for 2 seconds
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <CustomSplash />;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider>
        <AuthProvider>
          <PetProvider>
            <AppNavigator />
          </PetProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}