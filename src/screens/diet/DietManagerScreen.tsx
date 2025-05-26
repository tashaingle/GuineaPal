import BaseScreen from '@/components/BaseScreen';
import { DietPreferences, FeedingSchedule, RootStackParamList } from '@/navigation/types';
import { loadDietPreferences, loadFeedingSchedule, saveDietPreferences, saveFeedingSchedule } from '@/utils/petStorage';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DEFAULT_DIET_PREFERENCES: DietPreferences = {
  favoriteVegetables: [],
  favoriteFruits: [],
  allergies: [],
  restrictions: [],
  hayPreference: 'Timothy Hay'
};

const DEFAULT_FEEDING_SCHEDULE: FeedingSchedule = {
  hay: {
    frequency: 'daily',
    times: ['08:00'],
    amount: 'Unlimited'
  },
  pellets: {
    frequency: 'daily',
    times: ['09:00'],
    amount: '2 tablespoons'
  },
  vegetables: {
    frequency: 'daily',
    times: ['10:00'],
    items: []
  },
  fruits: {
    frequency: 'weekly',
    days: [0], // Sunday
    amount: '1-2 small pieces'
  }
};

const DietManagerScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DietManager'>>();
  const navigation = useNavigation<NavigationProp>();
  const { pet } = route.params;

  const [preferences, setPreferences] = useState<DietPreferences>(DEFAULT_DIET_PREFERENCES);
  const [schedule, setSchedule] = useState<FeedingSchedule>(DEFAULT_FEEDING_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [savedPreferences, savedSchedule] = await Promise.all([
        loadDietPreferences(pet.id),
        loadFeedingSchedule(pet.id)
      ]);
      
      if (savedPreferences) {
        setPreferences(savedPreferences);
      }
      if (savedSchedule) {
        setSchedule(savedSchedule);
      }
    } catch (error) {
      console.error('Failed to load diet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        saveDietPreferences(pet.id, preferences),
        saveFeedingSchedule(pet.id, schedule)
      ]);
      Alert.alert('Success', 'Diet preferences and schedule updated successfully');
    } catch (error) {
      console.error('Failed to save diet data:', error);
      Alert.alert('Error', 'Failed to save diet data');
    }
  };

  const addItem = (list: string[], setList: (items: string[]) => void) => {
    if (!newItem.trim()) return;
    setList([...list, newItem.trim()]);
    setNewItem('');
    setEditingSection(null);
  };

  const removeItem = (list: string[], setList: (items: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const renderList = (
    title: string,
    items: string[],
    onAdd: () => void,
    onRemove: (index: number) => void
  ) => (
    <View style={styles.listSection}>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText}>{item}</Text>
          <TouchableOpacity onPress={() => onRemove(index)}>
            <MaterialIcons name="remove-circle" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      ))}
      {editingSection === title ? (
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.input}
            value={newItem}
            onChangeText={setNewItem}
            placeholder={`Add new ${title.toLowerCase()}`}
            autoFocus
          />
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <MaterialIcons name="check" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addButton, styles.cancelButton]} 
            onPress={() => {
              setEditingSection(null);
              setNewItem('');
            }}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <BaseScreen
      title="Diet Manager"
      scrollable={false}
    >
      <FlatList
        style={styles.container}
        data={[
          {
            title: 'Favorite Vegetables',
            data: preferences.favoriteVegetables,
            onAdd: () => addItem(
              preferences.favoriteVegetables,
              items => setPreferences({ ...preferences, favoriteVegetables: items })
            ),
            onRemove: (index: number) => removeItem(
              preferences.favoriteVegetables,
              items => setPreferences({ ...preferences, favoriteVegetables: items }),
              index
            )
          },
          {
            title: 'Favorite Fruits',
            data: preferences.favoriteFruits,
            onAdd: () => addItem(
              preferences.favoriteFruits,
              items => setPreferences({ ...preferences, favoriteFruits: items })
            ),
            onRemove: (index: number) => removeItem(
              preferences.favoriteFruits,
              items => setPreferences({ ...preferences, favoriteFruits: items }),
              index
            )
          },
          {
            title: 'Allergies',
            data: preferences.allergies,
            onAdd: () => addItem(
              preferences.allergies,
              items => setPreferences({ ...preferences, allergies: items })
            ),
            onRemove: (index: number) => removeItem(
              preferences.allergies,
              items => setPreferences({ ...preferences, allergies: items }),
              index
            )
          }
        ]}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MaterialIcons name="restaurant" size={24} color="#5D4037" />
                <Text style={styles.sectionTitle}>{item.title}</Text>
              </View>
              <TouchableOpacity 
                style={styles.sectionAddButton}
                onPress={() => setEditingSection(item.title)}
              >
                <MaterialIcons name="add" size={24} color="#5D4037" />
              </TouchableOpacity>
            </View>
            {renderList(item.title, item.data, item.onAdd, item.onRemove)}
          </View>
        )}
        keyExtractor={item => item.title}
      />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037',
    marginLeft: 8
  },
  sectionAddButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(93, 64, 55, 0.1)'
  },
  listSection: {
    marginBottom: 16
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  listItemText: {
    fontSize: 14,
    color: '#5D4037',
    flex: 1
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  addButton: {
    backgroundColor: '#5D4037',
    borderRadius: 20,
    padding: 8
  },
  cancelButton: {
    backgroundColor: '#D32F2F'
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    fontSize: 14
  }
});

export default DietManagerScreen; 