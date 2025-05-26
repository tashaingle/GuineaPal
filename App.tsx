import { AuthProvider } from '@/contexts/AuthContext';
import { PetProvider } from '@/contexts/PetContext';
import AppNavigator from '@/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
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