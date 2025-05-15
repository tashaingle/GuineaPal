import React, { Suspense } from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet,
  TouchableOpacity 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { RootStackParamList } from './src/navigation/types';

enableScreens(true);

const HomeScreen = React.lazy(() => import('./src/screens/HomeScreen'));
const ChecklistScreen = React.lazy(() => import('./src/screens/ChecklistScreen'));
const HealthTrackerScreen = React.lazy(() => import('./src/screens/HealthTrackerScreen'));
const ProfileScreen = React.lazy(() => import('./src/screens/ProfileScreen'));
const BreedSelectionScreen = React.lazy(() => import('./src/screens/BreedSelectionScreen'));
const AddEditPetScreen = React.lazy(() => import('./src/screens/AddEditPetScreen'));

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#5D4037" />
  </View>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Suspense fallback={<LoadingScreen />}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ navigation }) => ({
              headerStyle: { 
                backgroundColor: '#5D4037',
              },
              headerShadowVisible: false,
              headerTintColor: '#fff',
              headerTitleStyle: { 
                fontWeight: 'bold',
                fontSize: 18 
              },
              headerBackTitle: '',
              animation: 'slide_from_right',
              contentStyle: { 
                backgroundColor: '#FFF8E1' 
              },
              headerLeft: ({ canGoBack }) => 
                canGoBack ? (
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginLeft: 10 }}
                  >
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
                ) : null
            })}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ 
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={({ route }) => ({ 
                title: `${route.params.pet.name}'s Profile`,
                headerTitleAlign: 'center'
              })}
            />
            <Stack.Screen 
              name="BreedSelection" 
              component={BreedSelectionScreen}
              options={{ 
                title: 'Select Breed',
                presentation: 'modal',
                headerTitleAlign: 'center'
              }}
            />
            <Stack.Screen 
              name="Checklist" 
              component={ChecklistScreen}
              options={{ 
                title: 'Daily Checklist',
                headerTitleAlign: 'center'
              }}
            />
            <Stack.Screen 
              name="HealthTracker" 
              component={HealthTrackerScreen}
              options={({ route }) => ({
                title: 'Health Tracker',
                headerTitleAlign: 'center',
                headerRight: () => (
                  <MaterialIcons 
                    name="info-outline" 
                    size={24} 
                    color="white" 
                    style={{ marginRight: 15 }}
                  />
                )
              })}
            />
            <Stack.Screen 
              name="AddEditPet" 
              component={AddEditPetScreen}
              options={({ route }) => ({
                title: route.params.mode === 'add' ? 'Add New Pet' : 'Edit Pet',
                presentation: 'modal',
                headerTitleAlign: 'center'
              })}
            />
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1'
  }
});

export default App;