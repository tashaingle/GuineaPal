import { useAuth } from '@/contexts/AuthContext';
import AchievementsScreen from '@/screens/AchievementsScreen';
import AddEditPetScreen from '@/screens/AddEditPetScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import BondingGuideScreen from '@/screens/BondingGuideScreen';
import BondingTimerScreen from '@/screens/BondingTimerScreen';
import BondingTrackerScreen from '@/screens/BondingTrackerScreen';
import BreedSelectionScreen from '@/screens/BreedSelectionScreen';
import CareScheduleScreen from '@/screens/care/CareScheduleScreen';
import CareGuideSectionScreen from '@/screens/CareGuideSection';
import ChecklistScreen from '@/screens/ChecklistScreen';
import DietManagerScreen from '@/screens/diet/DietManagerScreen';
import FamilyTreeScreen from '@/screens/FamilyTreeScreen';
import GuineaGramScreen from '@/screens/GuineaGramScreen';
import CareGuideScreen from '@/screens/GuineaPigLibraryScreen';
import AddWasteLogScreen from '@/screens/health/AddWasteLogScreen';
import MedicalRecordsScreen from '@/screens/health/MedicalRecordsScreen';
import MoodTrackerScreen from '@/screens/health/MoodTrackerScreen';
import WasteLogScreen from '@/screens/health/WasteLogScreen';
import WeightTrackerScreen from '@/screens/health/WeightTrackerScreen';
import NewOwnerChecklistScreen from '@/screens/NewOwnerChecklistScreen';
import PetListScreen from '@/screens/PetListScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SafeFoodsScreen from '@/screens/SafeFoodsScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import SymptomCheckerScreen from '@/screens/SymptomCheckerScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import colors from '@/theme/colors';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: colors.background.DEFAULT },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: colors.background.DEFAULT },
    }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="PetList" component={PetListScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="AddEditPet" component={AddEditPetScreen} />
    <Stack.Screen name="BreedSelection" component={BreedSelectionScreen} />
    <Stack.Screen name="Checklist" component={ChecklistScreen} />
    <Stack.Screen name="GuineaGram" component={GuineaGramScreen} />
    <Stack.Screen name="CareGuide" component={CareGuideScreen} />
    <Stack.Screen name="CareGuideSection" component={CareGuideSectionScreen} />
    <Stack.Screen name="SafeFoods" component={SafeFoodsScreen} />
    <Stack.Screen name="NewOwnerChecklist" component={NewOwnerChecklistScreen} />
    <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
    <Stack.Screen name="WeightTracker" component={WeightTrackerScreen} />
    <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
    <Stack.Screen name="CareSchedule" component={CareScheduleScreen} />
    <Stack.Screen name="DietManager" component={DietManagerScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
    <Stack.Screen name="BondingTracker" component={BondingTrackerScreen} />
    <Stack.Screen name="BondingTimer" component={BondingTimerScreen} />
    <Stack.Screen name="BondingGuide" component={BondingGuideScreen} />
    <Stack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
    <Stack.Screen name="FamilyTree" component={FamilyTreeScreen} />
    <Stack.Screen name="WasteLog" component={WasteLogScreen} />
    <Stack.Screen name="AddWasteLog" component={AddWasteLogScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background.DEFAULT,
      }}>
        <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color={colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 