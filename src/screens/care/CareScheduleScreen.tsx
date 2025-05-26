import BaseScreen from '@/components/BaseScreen';
import { CareSchedule, RootStackParamList } from '@/navigation/types';
import { loadCareSchedule, updateCareSchedule } from '@/utils/petStorage';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { Chip, IconButton, SegmentedButtons } from 'react-native-paper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const DEFAULT_SCHEDULE: CareSchedule = {
  cageCleaningDays: [0, 3], // Sunday and Wednesday
  nailTrimmingInterval: 30, // days
  floorTimeSchedule: {
    days: [1, 3, 5], // Monday, Wednesday, Friday
    duration: 30 // minutes
  },
  outdoorsTimeSchedule: {
    days: [1, 4], // Monday and Thursday
    duration: 30 // minutes
  },
  vitaminCSchedule: {
    frequency: 'daily',
    time: '09:00',
    amount: '1 drop'
  }
};

type EditingSections = {
  cageCleaning: boolean;
  nailTrimming: boolean;
  floorTime: boolean;
  outdoorsTime: boolean;
  vitaminC: boolean;
};

const CareScheduleScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CareSchedule'>>();
  const navigation = useNavigation<NavigationProp>();
  const { pet } = route.params;

  const [schedule, setSchedule] = useState<CareSchedule>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSections, setEditingSections] = useState<EditingSections>({
    cageCleaning: false,
    nailTrimming: false,
    floorTime: false,
    outdoorsTime: false,
    vitaminC: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const savedSchedule = await loadCareSchedule(pet.id);
      if (savedSchedule) {
        setSchedule(savedSchedule);
      }
    } catch (error) {
      console.error('Failed to load care schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (section: keyof EditingSections) => {
    try {
      await updateCareSchedule(pet.id, schedule);
      setEditingSections(prev => ({ ...prev, [section]: false }));
      Alert.alert('Success', 'Care schedule updated successfully');
    } catch (error) {
      console.error('Failed to save care schedule:', error);
      Alert.alert('Error', 'Failed to save care schedule');
    }
  };

  const toggleCleaningDay = (dayIndex: number) => {
    if (!editingSections.cageCleaning) return;
    
    const newDays = schedule.cageCleaningDays.includes(dayIndex)
      ? schedule.cageCleaningDays.filter(d => d !== dayIndex)
      : [...schedule.cageCleaningDays, dayIndex].sort();

    setSchedule({
      ...schedule,
      cageCleaningDays: newDays
    });
  };

  const toggleFloorTimeDay = (dayIndex: number) => {
    if (!editingSections.floorTime) return;

    const newDays = schedule.floorTimeSchedule.days.includes(dayIndex)
      ? schedule.floorTimeSchedule.days.filter(d => d !== dayIndex)
      : [...schedule.floorTimeSchedule.days, dayIndex].sort();

    setSchedule({
      ...schedule,
      floorTimeSchedule: {
        ...schedule.floorTimeSchedule,
        days: newDays
      }
    });
  };

  const toggleOutdoorsTimeDay = (dayIndex: number) => {
    if (!editingSections.outdoorsTime) return;

    const newDays = schedule.outdoorsTimeSchedule.days.includes(dayIndex)
      ? schedule.outdoorsTimeSchedule.days.filter(d => d !== dayIndex)
      : [...schedule.outdoorsTimeSchedule.days, dayIndex].sort();

    setSchedule({
      ...schedule,
      outdoorsTimeSchedule: {
        ...schedule.outdoorsTimeSchedule,
        days: newDays
      }
    });
  };

  const renderDaySelector = (
    selectedDays: number[],
    onToggle: (day: number) => void,
    isEditing: boolean
  ) => (
    <View style={styles.daysContainer}>
      {DAYS_OF_WEEK.map((day, index) => (
        <Chip
          key={day}
          selected={selectedDays.includes(index)}
          onPress={() => onToggle(index)}
          disabled={!isEditing}
          style={styles.dayChip}
          selectedColor="#5D4037"
          showSelectedCheck={true}
        >
          {day.slice(0, 3)}
        </Chip>
      ))}
    </View>
  );

  const renderSectionHeader = (
    title: string, 
    icon: keyof typeof MaterialIcons.glyphMap, 
    section: keyof EditingSections,
    onSave?: () => void
  ) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <MaterialIcons name={icon} size={24} color="#5D4037" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <IconButton
        icon={editingSections[section] ? 'check' : 'pencil'}
        iconColor="#5D4037"
        size={20}
        onPress={() => {
          if (editingSections[section] && onSave) {
            onSave();
          } else {
            setEditingSections(prev => ({
              ...prev,
              [section]: !prev[section]
            }));
          }
        }}
      />
    </View>
  );

  return (
    <BaseScreen title="Care Schedule Reminders">
      <ScrollView style={styles.container}>
        {/* Cage Cleaning Schedule */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Cage Cleaning', 
            'cleaning-services' as keyof typeof MaterialIcons.glyphMap, 
            'cageCleaning',
            () => handleSave('cageCleaning')
          )}
          <Text style={styles.sectionDescription}>
            Select days for regular cage cleaning
          </Text>
          {renderDaySelector(
            schedule.cageCleaningDays, 
            toggleCleaningDay,
            editingSections.cageCleaning
          )}
          {schedule.lastCageCleaning && (
            <Text style={styles.lastCleanedText}>
              Last cleaned: {new Date(schedule.lastCageCleaning).toLocaleDateString()}
            </Text>
          )}
        </View>

        {/* Nail Trimming Schedule */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Nail Trimming', 
            'content-cut' as keyof typeof MaterialIcons.glyphMap, 
            'nailTrimming',
            () => handleSave('nailTrimming')
          )}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Interval (days):</Text>
            <TextInput
              style={[styles.input, !editingSections.nailTrimming && styles.disabledInput]}
              value={schedule.nailTrimmingInterval.toString()}
              onChangeText={(value) => {
                const interval = parseInt(value) || 30;
                setSchedule({
                  ...schedule,
                  nailTrimmingInterval: interval
                });
              }}
              keyboardType="numeric"
              editable={editingSections.nailTrimming}
            />
          </View>
          {schedule.lastNailTrimming && (
            <Text style={styles.lastTrimmedText}>
              Last trimmed: {new Date(schedule.lastNailTrimming).toLocaleDateString()}
            </Text>
          )}
        </View>

        {/* Floor Time Schedule */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Floor Time', 
            'pets' as keyof typeof MaterialIcons.glyphMap, 
            'floorTime',
            () => handleSave('floorTime')
          )}
          <Text style={styles.sectionDescription}>
            Select days for floor time
          </Text>
          {renderDaySelector(
            schedule.floorTimeSchedule.days, 
            toggleFloorTimeDay,
            editingSections.floorTime
          )}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Duration (minutes):</Text>
            <TextInput
              style={[styles.input, !editingSections.floorTime && styles.disabledInput]}
              value={schedule.floorTimeSchedule.duration.toString()}
              onChangeText={(value) => {
                const duration = parseInt(value) || 30;
                setSchedule({
                  ...schedule,
                  floorTimeSchedule: {
                    ...schedule.floorTimeSchedule,
                    duration
                  }
                });
              }}
              keyboardType="numeric"
              editable={editingSections.floorTime}
            />
          </View>
        </View>

        {/* Outdoors Time Schedule */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Outdoors Time',
            'wb-sunny' as keyof typeof MaterialIcons.glyphMap,
            'outdoorsTime',
            () => handleSave('outdoorsTime')
          )}
          <Text style={styles.sectionDescription}>
            Select days for outdoor time
          </Text>
          {renderDaySelector(
            schedule.outdoorsTimeSchedule.days,
            toggleOutdoorsTimeDay,
            editingSections.outdoorsTime
          )}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Duration (minutes):</Text>
            <TextInput
              style={[styles.input, !editingSections.outdoorsTime && styles.disabledInput]}
              value={schedule.outdoorsTimeSchedule.duration.toString()}
              onChangeText={(value) => {
                const duration = parseInt(value) || 30;
                setSchedule({
                  ...schedule,
                  outdoorsTimeSchedule: {
                    ...schedule.outdoorsTimeSchedule,
                    duration
                  }
                });
              }}
              keyboardType="numeric"
              editable={editingSections.outdoorsTime}
            />
          </View>
        </View>

        {/* Vitamin C Schedule */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Vitamin C', 
            'local-pharmacy' as keyof typeof MaterialIcons.glyphMap, 
            'vitaminC',
            () => handleSave('vitaminC')
          )}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Frequency:</Text>
            <SegmentedButtons
              value={schedule.vitaminCSchedule.frequency}
              onValueChange={(value) => {
                if (!editingSections.vitaminC) return;
                setSchedule({
                  ...schedule,
                  vitaminCSchedule: {
                    ...schedule.vitaminCSchedule,
                    frequency: value as 'daily' | 'weekly'
                  }
                });
              }}
              buttons={[
                { 
                  value: 'daily', 
                  label: 'Daily',
                  disabled: !editingSections.vitaminC
                },
                { 
                  value: 'weekly', 
                  label: 'Weekly',
                  disabled: !editingSections.vitaminC
                }
              ]}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Time:</Text>
            <TextInput
              style={[styles.input, !editingSections.vitaminC && styles.disabledInput]}
              value={schedule.vitaminCSchedule.time}
              onChangeText={(value) => {
                setSchedule({
                  ...schedule,
                  vitaminCSchedule: {
                    ...schedule.vitaminCSchedule,
                    time: value
                  }
                });
              }}
              placeholder="HH:MM"
              editable={editingSections.vitaminC}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Amount:</Text>
            <TextInput
              style={[styles.input, !editingSections.vitaminC && styles.disabledInput]}
              value={schedule.vitaminCSchedule.amount}
              onChangeText={(value) => {
                setSchedule({
                  ...schedule,
                  vitaminCSchedule: {
                    ...schedule.vitaminCSchedule,
                    amount: value
                  }
                });
              }}
              placeholder="e.g., 1 drop"
              editable={editingSections.vitaminC}
            />
          </View>
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1'
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
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between'
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
  sectionDescription: {
    fontSize: 14,
    color: '#795548',
    marginBottom: 12
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  dayChip: {
    marginBottom: 8
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  inputLabel: {
    flex: 1,
    fontSize: 16,
    color: '#5D4037'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: 'white'
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#9E9E9E'
  },
  lastCleanedText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginTop: 8
  },
  lastTrimmedText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginTop: 8
  }
});

export default CareScheduleScreen; 