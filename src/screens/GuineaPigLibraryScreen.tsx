import { RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'CareGuide'>;

const sections = [
  {
    title: 'Housing',
    icon: 'home',
    color: colors.primary.DEFAULT,
  },
  {
    title: 'Diet & Nutrition',
    icon: 'restaurant',
    color: colors.primary.DEFAULT,
  },
  {
    title: 'Health & Grooming',
    icon: 'healing',
    color: colors.primary.DEFAULT,
  },
  {
    title: 'Exercise & Play',
    icon: 'sports',
    color: colors.primary.DEFAULT,
  },
  {
    title: 'Behavior',
    icon: 'psychology',
    color: colors.primary.DEFAULT,
  },
  {
    title: 'Social Needs',
    icon: 'groups',
    color: colors.primary.DEFAULT,
  },
  {
    title: 'Safe Foods Guide',
    icon: 'restaurant-menu',
    color: colors.secondary.DEFAULT,
    isSpecialSection: true,
  },
  {
    title: 'New Owner Checklist',
    icon: 'checklist',
    color: colors.secondary.DEFAULT,
    isSpecialSection: true,
  },
];

const GuineaPigLibraryScreen: React.FC<Props> = ({ navigation }) => {
  const handleSectionPress = (section: typeof sections[0]) => {
    if (section.isSpecialSection) {
      if (section.title === 'Safe Foods Guide') {
        navigation.navigate('SafeFoods');
      } else if (section.title === 'New Owner Checklist') {
        navigation.navigate('NewOwnerChecklist');
      }
      return;
    }
    
    navigation.navigate('CareGuideSection', { sectionId: section.title });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <Text style={styles.title}>Guinea Pig Care Guide</Text>
        </View>
        <Text style={styles.subtitle}>
          Everything you need to know about guinea pig care
        </Text>
      </View>

      <ScrollView>
        <View style={styles.grid}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.title}
              style={[
                styles.sectionButton,
                { 
                  backgroundColor: '#FFFFFF',
                  borderColor: section.color,
                  borderWidth: 1,
                }
              ]}
              onPress={() => handleSectionPress(section)}
            >
              <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                <MaterialIcons
                  name={section.icon as keyof typeof MaterialIcons.glyphMap}
                  size={24}
                  color={section.color}
                />
              </View>
              <Text style={[styles.buttonTitle, { color: section.color }]}>{section.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#5D4037' + '99',
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionButton: {
    width: '48%',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GuineaPigLibraryScreen; 