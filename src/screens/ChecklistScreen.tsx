import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  timeOfDay: 'morning' | 'evening';
}

const DailyCareChecklist = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', task: 'Fresh hay refill', completed: false, timeOfDay: 'morning' },
    { id: '2', task: 'Clean water check', completed: false, timeOfDay: 'morning' },
    { id: '3', task: 'Vegetable feeding', completed: false, timeOfDay: 'morning' },
    { id: '4', task: 'Cage spot clean', completed: false, timeOfDay: 'evening' },
    { id: '5', task: 'Health check (eyes, nose, fur)', completed: false, timeOfDay: 'evening' },
    { id: '6', task: 'Vitamin C supplement', completed: false, timeOfDay: 'evening' },
  ]);

  
  useEffect(() => {
    const loadChecklist = async () => {
      try {
        const saved = await AsyncStorage.getItem('@guineapal_checklist');
        if (saved) setChecklist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load checklist', e);
      }
    };
    loadChecklist();
  }, []);

  
  useEffect(() => {
    const saveChecklist = async () => {
      try {
        await AsyncStorage.setItem('@guineapal_checklist', JSON.stringify(checklist));
      } catch (e) {
        console.error('Failed to save checklist', e);
      }
    };
    saveChecklist();
  }, [checklist]);

  const toggleTask = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const resetDailyTasks = () => {
    setChecklist(prev =>
      prev.map(item => ({ ...item, completed: false }))
    );
  };

  const renderItem = ({ item }: { item: ChecklistItem }) => (
    <View style={styles.item}>
      <Checkbox
        status={item.completed ? 'checked' : 'unchecked'}
        onPress={() => toggleTask(item.id)}
        color="#4CAF50"
      />
      <Text style={[styles.task, item.completed && styles.completedTask]}>
        {item.task}
      </Text>
      <View style={[styles.timePill, 
                   { backgroundColor: item.timeOfDay === 'morning' ? '#FFECB3' : '#B3E5FC' }]}>
        <Text>{item.timeOfDay}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Care Checklist</Text>
      
      <FlatList
        data={checklist}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity style={styles.resetButton} onPress={resetDailyTasks}>
        <Text style={styles.resetText}>Reset All Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8E1',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5D4037',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  task: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#212121',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  timePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  resetButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#5D4037',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DailyCareChecklist;