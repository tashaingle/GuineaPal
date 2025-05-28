import { RootStackParamList } from '@/navigation/types';
import AchievementsScreen from '@/screens/AchievementsScreen';
import AddEditPetScreen from '@/screens/AddEditPetScreen';
import BondingGuideScreen from '@/screens/BondingGuideScreen';
import BondingTimerScreen from '@/screens/BondingTimerScreen';
import BondingTrackerScreen from '@/screens/BondingTrackerScreen';
import BreedSelectionScreen from '@/screens/BreedSelectionScreen';
import CareScheduleScreen from '@/screens/care/CareScheduleScreen';
import ChecklistScreen from '@/screens/ChecklistScreen';
import DietManagerScreen from '@/screens/diet/DietManagerScreen';
import GuineaGramScreen from '@/screens/GuineaGramScreen';
import CareGuideScreen from '@/screens/GuineaPigLibraryScreen';
import AddWasteLogScreen from '@/screens/health/AddWasteLogScreen';
import MedicalRecordsScreen from '@/screens/health/MedicalRecordsScreen';
import MoodTrackerScreen from '@/screens/health/MoodTrackerScreen';
import WasteLogScreen from '@/screens/health/WasteLogScreen';
import WeightTrackerScreen from '@/screens/health/WeightTrackerScreen';
import PetListScreen from '@/screens/PetListScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import colors from '@/theme/colors';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import * as React from 'react';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Define screen options outside of the component to prevent recreation
const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background.DEFAULT },
  animation: 'none',
  animationTypeForReplace: 'pop',
  gestureEnabled: false,
  presentation: 'card',
  freezeOnBlur: true
};

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={screenOptions}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
      />
      <Stack.Screen 
        name="PetList" 
        component={PetListScreen}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
      <Stack.Screen 
        name="AddEditPet" 
        component={AddEditPetScreen}
      />
      <Stack.Screen 
        name="BreedSelection" 
        component={BreedSelectionScreen}
      />
      <Stack.Screen 
        name="Checklist" 
        component={ChecklistScreen}
      />
      <Stack.Screen 
        name="GuineaGram" 
        component={GuineaGramScreen}
      />
      <Stack.Screen 
        name="CareGuide" 
        component={CareGuideScreen}
      />
      
      {/* Health & Care Screens */}
      <Stack.Screen 
        name="MedicalRecords" 
        component={MedicalRecordsScreen}
      />
      <Stack.Screen 
        name="WeightTracker" 
        component={WeightTrackerScreen}
      />
      <Stack.Screen 
        name="MoodTracker" 
        component={MoodTrackerScreen}
      />
      <Stack.Screen 
        name="CareSchedule" 
        component={CareScheduleScreen}
      />
      <Stack.Screen 
        name="DietManager" 
        component={DietManagerScreen}
      />
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen}
      />
      <Stack.Screen 
        name="BondingTracker" 
        component={BondingTrackerScreen}
      />
      <Stack.Screen 
        name="BondingTimer" 
        component={BondingTimerScreen}
      />
      <Stack.Screen 
        name="BondingGuide" 
        component={BondingGuideScreen}
      />
      <Stack.Screen 
        name="WasteLog" 
        component={WasteLogScreen}
      />
      <Stack.Screen 
        name="AddWasteLog" 
        component={AddWasteLogScreen}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default RootNavigator; 