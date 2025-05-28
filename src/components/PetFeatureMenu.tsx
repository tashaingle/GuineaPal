import { GuineaPig, RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ScreenName = keyof Pick<RootStackParamList, 
  'WeightTracker' | 
  'MedicalRecords' | 
  'CareSchedule' | 
  'DietManager' | 
  'MoodTracker' | 
  'WasteLog' | 
  'FamilyTree'
>;

type FeatureMenuItem = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  screen: ScreenName;
  color: string;
  description: string;
};

// Move MENU_ITEMS outside component to prevent recreation
const MENU_ITEMS: FeatureMenuItem[] = [
  {
    title: 'Family Tree',
    icon: 'family-restroom',
    screen: 'FamilyTree',
    color: colors.primary.DEFAULT,
    description: 'Track family relationships'
  },
  {
    title: 'Mood Tracker',
    icon: 'mood',
    screen: 'MoodTracker',
    color: colors.secondary.DEFAULT,
    description: 'Monitor mood and behavior'
  },
  {
    title: 'Weight History',
    icon: 'line-weight',
    screen: 'WeightTracker',
    color: colors.primary.DEFAULT,
    description: 'Monitor weight changes'
  },
  {
    title: 'Medical Records',
    icon: 'medical-services',
    screen: 'MedicalRecords',
    color: colors.secondary.DEFAULT,
    description: 'Manage medications and vet visits'
  },
  {
    title: 'Care Schedule Reminders',
    icon: 'event',
    screen: 'CareSchedule',
    color: colors.primary.DEFAULT,
    description: 'Manage care routines and reminders'
  },
  {
    title: 'Diet Manager',
    icon: 'restaurant',
    screen: 'DietManager',
    color: colors.secondary.DEFAULT,
    description: 'Track diet and feeding schedule'
  },
  {
    title: 'Waste Log',
    icon: 'pets',
    screen: 'WasteLog',
    color: colors.primary.DEFAULT,
    description: 'Track waste patterns and health'
  }
];

type Props = {
  pet: GuineaPig;
};

const PetFeatureMenu = React.memo(({ pet }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const handleNavigation = (screen: ScreenName) => {
    console.log('Navigating to:', screen, 'with petId:', pet.id);
    
    // Special handling for FamilyTree screen which needs the full pet object
    if (screen === 'FamilyTree') {
      navigation.navigate('FamilyTree', { 
        pet,
        onUpdate: () => {} // Add an empty callback since it's optional
      });
      return;
    }

    // For other screens that need petId
    navigation.navigate(screen, { petId: pet.id });
  };

  return (
    <View style={styles.container}>
      {MENU_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.screen}
          style={[styles.menuItem, { backgroundColor: item.color + '10' }]}
          onPress={() => handleNavigation(item.screen)}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
            <MaterialIcons name={item.icon} size={24} color={item.color} />
          </View>
          <Text style={[styles.menuTitle, { color: item.color }]}>{item.title}</Text>
          <Text style={[styles.menuDescription, { color: item.color + '99' }]} numberOfLines={2}>
            {item.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

PetFeatureMenu.displayName = 'PetFeatureMenu';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8
  },
  menuItem: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3
  },
  menuDescription: {
    fontSize: 12,
    lineHeight: 16
  }
});

export default PetFeatureMenu; 