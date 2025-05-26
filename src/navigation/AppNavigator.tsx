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
import CreateForumPostScreen from '@/screens/CreateForumPostScreen';
import DietManagerScreen from '@/screens/diet/DietManagerScreen';
import FamilyTreeScreen from '@/screens/FamilyTreeScreen';
import ForumPostScreen from '@/screens/ForumPostScreen';
import GuineaGramScreen from '@/screens/GuineaGramScreen';
import CareGuideScreen from '@/screens/GuineaPigLibraryScreen';
import MedicalRecordsScreen from '@/screens/health/MedicalRecordsScreen';
import MoodTrackerScreen from '@/screens/health/MoodTrackerScreen';
import WeightTrackerScreen from '@/screens/health/WeightTrackerScreen';
import NewOwnerChecklistScreen from '@/screens/NewOwnerChecklistScreen';
import NewsOfTheWheekScreen from '@/screens/NewsOfTheWheekScreen';
import PetListScreen from '@/screens/PetListScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SafeFoodsScreen from '@/screens/SafeFoodsScreen';
import SymptomCheckerScreen from '@/screens/SymptomCheckerScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: '#FFF8E1' },
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
      contentStyle: { backgroundColor: '#FFF8E1' },
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
    <Stack.Screen name="NewsOfTheWheek" component={NewsOfTheWheekScreen} />
    <Stack.Screen name="ForumPost" component={ForumPostScreen} />
    <Stack.Screen name="CreateForumPost" component={CreateForumPostScreen} />
    <Stack.Screen name="BondingTracker" component={BondingTrackerScreen} />
    <Stack.Screen name="BondingTimer" component={BondingTimerScreen} />
    <Stack.Screen name="BondingGuide" component={BondingGuideScreen} />
    <Stack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
    <Stack.Screen name="FamilyTree" component={FamilyTreeScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8E1' }}>
        <ActivityIndicator size="large" color="#5D4037" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 