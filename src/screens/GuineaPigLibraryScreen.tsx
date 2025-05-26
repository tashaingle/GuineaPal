import { CARE_GUIDE_CONTENT } from '@/data/careGuideContent';
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
    color: colors.buttons.blue,
  },
  {
    title: 'Diet & Nutrition',
    icon: 'restaurant',
    color: colors.buttons.green,
  },
  {
    title: 'Health & Grooming',
    icon: 'healing',
    color: colors.buttons.red,
  },
  {
    title: 'Exercise & Play',
    icon: 'sports',
    color: colors.buttons.orange,
  },
  {
    title: 'Behavior',
    icon: 'psychology',
    color: colors.buttons.purple,
  },
  {
    title: 'Social Needs',
    icon: 'groups',
    color: colors.buttons.cyan,
  },
  {
    title: 'Safe Foods Guide',
    icon: 'restaurant-menu',
    color: colors.buttons.green,
    isSpecialSection: true,
  },
  {
    title: 'New Owner Checklist',
    icon: 'checklist',
    color: colors.buttons.blue,
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
    
    const content = CARE_GUIDE_CONTENT[section.title as keyof typeof CARE_GUIDE_CONTENT];
    if (content) {
      navigation.navigate('CareGuideSection', content);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.buttons.purple + '10' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.purple} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.buttons.purple }]}>Guinea Pig Care Guide</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.buttons.purple + '99' }]}>
          Everything you need to know about guinea pig care
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.title}
              style={[
                styles.sectionButton,
                { backgroundColor: section.color + '10' }
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
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
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