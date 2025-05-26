import { RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'NewOwnerChecklist'>;

interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  info?: string;
}

interface ChecklistCategory {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  items: ChecklistItem[];
}

const CHECKLIST_DATA: ChecklistCategory[] = [
  {
    title: 'Housing Essentials',
    icon: 'home',
    items: [
      { id: 'cage', text: 'Large cage (min. 7.5 sq ft for 1-2 pigs)', isCompleted: false, info: 'C&C cages or large pet store cages recommended' },
      { id: 'bedding', text: 'Safe bedding material', isCompleted: false, info: 'Fleece liners or paper-based bedding' },
      { id: 'hideout', text: 'At least one hideout per pig', isCompleted: false },
      { id: 'water-bottle', text: 'Water bottle or bowl', isCompleted: false },
      { id: 'food-bowl', text: 'Heavy food bowl', isCompleted: false },
      { id: 'hay-rack', text: 'Hay rack or holder', isCompleted: false },
    ],
  },
  {
    title: 'Food & Nutrition',
    icon: 'restaurant',
    items: [
      { id: 'hay', text: 'High-quality timothy hay', isCompleted: false, info: 'Main diet component (80%)' },
      { id: 'pellets', text: 'Guinea pig pellets', isCompleted: false, info: 'Choose vitamin C fortified pellets' },
      { id: 'veggies', text: 'Fresh vegetables', isCompleted: false, info: 'Bell peppers, romaine lettuce, cucumber' },
      { id: 'vitamin-c', text: 'Vitamin C supplement', isCompleted: false },
    ],
  },
  {
    title: 'Grooming Supplies',
    icon: 'content-cut',
    items: [
      { id: 'brush', text: 'Soft brush', isCompleted: false },
      { id: 'nail-clippers', text: 'Small animal nail clippers', isCompleted: false },
      { id: 'shampoo', text: 'Guinea pig safe shampoo', isCompleted: false },
      { id: 'towels', text: 'Soft towels for grooming', isCompleted: false },
    ],
  },
  {
    title: 'Health & Safety',
    icon: 'healing',
    items: [
      { id: 'first-aid', text: 'Basic first aid supplies', isCompleted: false },
      { id: 'carrier', text: 'Pet carrier for vet visits', isCompleted: false },
      { id: 'vet', text: 'Find an exotic vet', isCompleted: false, info: 'Locate a vet experienced with guinea pigs' },
      { id: 'scale', text: 'Small digital scale', isCompleted: false, info: 'For weekly weight monitoring' },
    ],
  },
  {
    title: 'Enrichment',
    icon: 'toys',
    items: [
      { id: 'toys', text: 'Safe toys and tunnels', isCompleted: false },
      { id: 'playpen', text: 'Exercise pen or playpen', isCompleted: false },
      { id: 'floor-protection', text: 'Floor protection for playtime', isCompleted: false },
      { id: 'chew-toys', text: 'Safe items to chew', isCompleted: false, info: 'Wood blocks, loofah, hay cubes' },
    ],
  },
  {
    title: 'Maintenance',
    icon: 'cleaning-services',
    items: [
      { id: 'cleaning-supplies', text: 'Pet-safe cleaning supplies', isCompleted: false },
      { id: 'extra-bedding', text: 'Extra bedding material', isCompleted: false },
      { id: 'storage', text: 'Storage containers for supplies', isCompleted: false },
      { id: 'waste-bags', text: 'Waste disposal bags', isCompleted: false },
    ],
  },
];

const NewOwnerChecklistScreen: React.FC<Props> = ({ navigation }) => {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(CHECKLIST_DATA);

  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('newOwnerChecklist');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setChecklist(checklist.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            isCompleted: parsedProgress[item.id] || false,
          })),
        })));
      }
    } catch (error) {
      console.error('Error loading checklist progress:', error);
    }
  };

  const saveProgress = async (updatedChecklist: ChecklistCategory[]) => {
    try {
      const progress = updatedChecklist.reduce((acc, category) => {
        category.items.forEach(item => {
          acc[item.id] = item.isCompleted;
        });
        return acc;
      }, {} as Record<string, boolean>);
      await AsyncStorage.setItem('newOwnerChecklist', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving checklist progress:', error);
    }
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[categoryIndex].items[itemIndex].isCompleted = 
      !updatedChecklist[categoryIndex].items[itemIndex].isCompleted;
    setChecklist(updatedChecklist);
    saveProgress(updatedChecklist);
  };

  const calculateProgress = () => {
    const totalItems = checklist.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = checklist.reduce((sum, category) => 
      sum + category.items.filter(item => item.isCompleted).length, 0);
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.buttons.blue + '10' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.blue} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.buttons.blue }]}>New Owner Checklist</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: colors.buttons.blue }]}>
            Progress: {calculateProgress()}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${calculateProgress()}%`,
                  backgroundColor: colors.buttons.blue 
                }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {checklist.map((category, categoryIndex) => (
          <Card key={category.title} style={styles.card}>
            <Card.Content>
              <View style={styles.categoryHeader}>
                <MaterialIcons name={category.icon} size={24} color={colors.buttons.blue} />
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              {category.items.map((item, itemIndex) => (
                <View key={item.id} style={styles.checklistItem}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleItem(categoryIndex, itemIndex)}
                  >
                    <Checkbox.Android
                      status={item.isCompleted ? 'checked' : 'unchecked'}
                      color={colors.buttons.blue}
                    />
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemText}>{item.text}</Text>
                      {item.info && (
                        <Text style={styles.itemInfo}>{item.info}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  progressContainer: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037',
    marginLeft: 8,
  },
  checklistItem: {
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#5D4037',
  },
  itemInfo: {
    fontSize: 14,
    color: '#795548',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default NewOwnerChecklistScreen; 