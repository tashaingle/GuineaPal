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
      selectedColor: colors.accent.primary
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
          <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color={colors.accent.primary} />
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
      <View style={[styles.header, { 
        backgroundColor: colors.background.card,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
      }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text.primary }]}>Care Checklist</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            markedDates={getMarkedDates()}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: colors.accent.primary,
              todayTextColor: colors.accent.primary,
              arrowColor: colors.accent.primary,
              monthTextColor: colors.text.primary,
              textMonthFontSize: 16,
              textMonthFontWeight: 'bold',
              calendarBackground: colors.white,
              dayTextColor: colors.text.primary,
              textDayFontSize: 14,
            }}
          />
        </View>

        {tasks.map((taskGroup) => (
          <View
            key={taskGroup.title}
            style={[styles.taskGroup, { backgroundColor: colors.white }]}
          >
            <View style={styles.taskGroupHeader}>
              <MaterialIcons name={taskGroup.icon} size={24} color={taskGroup.color} />
              <Text style={[styles.taskGroupTitle, { color: colors.text.primary }]}>
                {taskGroup.title}
              </Text>
            </View>
            {taskGroup.items.map((task, index) => {
              const item = checklist.find(
                (i) => i.task === task && i.date === selectedDate
              );
              if (!item) return null;
              return (
                <TouchableOpacity
                  key={`${taskGroup.title}-${index}`}
                  style={[styles.taskItem, { borderTopColor: colors.border.light }]}
                  onPress={() => toggleTask(item.id)}
                >
                  <Checkbox
                    status={item.completed ? 'checked' : 'unchecked'}
                    onPress={() => toggleTask(item.id)}
                    color={taskGroup.color}
                  />
                  <Text style={[styles.taskText, { color: colors.text.primary }]}>
                    {task}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 16,
    padding: 8
  },
  title: {
    fontSize: 24,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 16
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  taskGroup: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  taskGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white
  },
  taskGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1
  },
  taskText: {
    fontSize: 16,
    marginLeft: 8
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
    padding: 16
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ChecklistScreen;