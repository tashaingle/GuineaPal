import { GuineaPig, RootStackParamList } from '@/navigation/types';
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

type ScreenName = 'WeightTracker' | 'MedicalRecords' | 'CareSchedule' | 'DietManager' | 'MoodTracker' | 'WasteLog' | 'FamilyTree';

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
    color: '#3F51B5',
    description: 'Track family relationships'
  },
  {
    title: 'Mood Tracker',
    icon: 'mood',
    screen: 'MoodTracker',
    color: '#E91E63',
    description: 'Monitor mood and behavior'
  },
  {
    title: 'Weight History',
    icon: 'line-weight',
    screen: 'WeightTracker',
    color: '#9C27B0',
    description: 'Monitor weight changes'
  },
  {
    title: 'Medical Records',
    icon: 'medical-services',
    screen: 'MedicalRecords',
    color: '#2196F3',
    description: 'Manage medications and vet visits'
  },
  {
    title: 'Care Schedule Reminders',
    icon: 'event',
    screen: 'CareSchedule',
    color: '#FF9800',
    description: 'Manage care routines and reminders'
  },
  {
    title: 'Diet Manager',
    icon: 'restaurant',
    screen: 'DietManager',
    color: '#795548',
    description: 'Track diet and feeding schedule'
  },
  {
    title: 'Waste Log',
    icon: 'pets',
    screen: 'WasteLog',
    color: '#795548',
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
    switch (screen) {
      case 'WasteLog':
        navigation.navigate('WasteLog', { petId: pet.id });
        break;
      default:
        navigation.navigate(screen, { pet });
    }
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