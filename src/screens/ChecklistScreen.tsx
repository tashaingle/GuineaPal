import { RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Checkbox } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  timeOfDay: 'morning' | 'evening';
  date: string;
}

interface Task {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  items: string[];
}

type Props = NativeStackScreenProps<RootStackParamList, 'Checklist'>;

const tasks: Task[] = [
  {
    title: 'Morning Care',
    icon: 'wb-sunny',
    color: colors.buttons.orange,
    items: ['Fresh hay', 'Clean water', 'Morning veggies', 'Health check']
  },
  {
    title: 'Evening Care',
    icon: 'nights-stay',
    color: colors.buttons.indigo,
    items: ['Fresh hay', 'Clean water', 'Evening veggies', 'Spot clean cage']
  },
  {
    title: 'Weekly Tasks',
    icon: 'event',
    color: colors.buttons.purple,
    items: ['Deep clean cage', 'Weigh guinea pigs', 'Check supplies', 'Trim nails if needed']
  },
  {
    title: 'Daily Health Checks',
    icon: 'favorite',
    color: colors.buttons.red,
    items: ['Check weight', 'Monitor eating', 'Check for injuries', 'Note behavior changes']
  }
];

const ChecklistScreen: React.FC<Props> = ({ navigation }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadChecklist();
  }, [selectedDate]);

  const loadChecklist = async () => {
    try {
      setIsLoading(true);
      const savedChecklist = await AsyncStorage.getItem(`checklist_${selectedDate}`);
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      } else {
        // Initialize with default tasks for the selected date
        const defaultChecklist: ChecklistItem[] = tasks.flatMap(taskGroup => 
          taskGroup.items.map((item, index) => ({
            id: `${taskGroup.title}-${index}`,
            task: item,
            completed: false,
            timeOfDay: taskGroup.title.toLowerCase().includes('morning') ? 'morning' : 'evening',
            date: selectedDate
          }))
        );
        setChecklist(defaultChecklist);
        await AsyncStorage.setItem(`checklist_${selectedDate}`, JSON.stringify(defaultChecklist));
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load checklist:', err);
      setError('Failed to load checklist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const updatedChecklist = checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setChecklist(updatedChecklist);
      await AsyncStorage.setItem(`checklist_${selectedDate}`, JSON.stringify(updatedChecklist));
    } catch (err) {
      console.error('Failed to update task:', err);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const resetChecklist = async () => {
    try {
      const resetList = checklist.map(item => ({ ...item, completed: false }));
      setChecklist(resetList);
      await AsyncStorage.setItem(`checklist_${selectedDate}`, JSON.stringify(resetList));
    } catch (err) {
      console.error('Failed to reset checklist:', err);
      Alert.alert('Error', 'Failed to reset checklist. Please try again.');
    }
  };

  const getMarkedDates = () => {
    const markedDates: any = {};
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.buttons.green
    };
    return markedDates;
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color="#5D4037" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadChecklist}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.buttons.green + '10' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.green} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.buttons.green }]}>Care Checklist</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            markedDates={getMarkedDates()}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: colors.buttons.green,
              todayTextColor: colors.buttons.green,
              arrowColor: colors.buttons.green,
              monthTextColor: colors.text.primary,
              textMonthFontSize: 16,
              textMonthFontWeight: 'bold',
            }}
          />
        </View>

        <View style={styles.grid}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.title}
              style={[styles.taskCard, { backgroundColor: task.color + '10' }]}
              onPress={() => setSelectedTask(task.title)}
            >
              <View style={[styles.taskIconContainer, { backgroundColor: task.color + '20' }]}>
                <MaterialIcons name={task.icon} size={24} color={task.color} />
              </View>
              <Text style={[styles.taskTitle, { color: task.color }]}>{task.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTask && (
          <View style={styles.taskDetails}>
            <Text style={[styles.taskTitle, { color: tasks.find(t => t.title === selectedTask)?.color }]}>
              {selectedTask} - {new Date(selectedDate).toLocaleDateString()}
            </Text>
            <View style={styles.taskList}>
              {tasks.find(t => t.title === selectedTask)?.items.map((item, index) => {
                const taskId = `${selectedTask}-${index}`;
                const taskItem = checklist.find(t => t.id === taskId) || {
                  id: taskId,
                  task: item,
                  completed: false,
                  timeOfDay: 'morning',
                  date: selectedDate
                };
                
                return (
                  <TouchableOpacity
                    key={taskId}
                    style={styles.taskItem}
                    onPress={() => toggleTask(taskId)}
                    activeOpacity={0.7}
                  >
                    <Checkbox
                      status={taskItem.completed ? 'checked' : 'unchecked'}
                      onPress={() => toggleTask(taskId)}
                      color={tasks.find(t => t.title === selectedTask)?.color}
                    />
                    <Text style={[
                      styles.taskText,
                      taskItem.completed && styles.completedTask
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  calendarContainer: {
    margin: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  taskCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  taskIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  taskDetails: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskList: {
    gap: 12,
    marginTop: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: colors.text.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24
  },
  retryButton: {
    backgroundColor: '#5D4037',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ChecklistScreen;