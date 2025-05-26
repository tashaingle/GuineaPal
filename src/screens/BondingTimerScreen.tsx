import { BondingSession, GuineaPig, RootStackParamList } from '@/navigation/types';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    BackHandler,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Chip, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'BondingTimer'>;

const COMMON_BEHAVIORS = [
  'Popcorning',
  'Rumbling',
  'Chasing',
  'Mounting',
  'Fighting',
  'Sharing Food',
  'Grooming',
  'Sleeping Together',
  'Chatting',
];

const COMMON_LOCATIONS = [
  'Playpen',
  'Floor Time',
  'Neutral Space',
  'Main Cage',
  'Outside',
];

const BondingTimerScreen = ({ navigation, route }: Props) => {
  const [selectedPets, setSelectedPets] = useState<GuineaPig[]>([]);
  const [allPets, setAllPets] = useState<GuineaPig[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [location, setLocation] = useState('');
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPetData();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const loadPetData = async () => {
    try {
      const pets = await loadPets();
      setAllPets(pets);
      
      if (route.params.pets.length > 0) {
        const preselectedPets = pets.filter(p => route.params.pets.includes(p.id));
        setSelectedPets(preselectedPets);
      }
    } catch (error) {
      console.error('Failed to load pets:', error);
      Alert.alert('Error', 'Failed to load pet data');
    }
  };

  const handleBackPress = () => {
    if (isRunning) {
      Alert.alert(
        'Session in Progress',
        'Do you want to end the current bonding session?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'End Session', style: 'destructive', onPress: handleEndSession }
        ]
      );
      return true;
    }
    return false;
  };

  const togglePet = (pet: GuineaPig) => {
    setSelectedPets(prev =>
      prev.find(p => p.id === pet.id)
        ? prev.filter(p => p.id !== pet.id)
        : [...prev, pet]
    );
  };

  const toggleBehavior = (behavior: string) => {
    setSelectedBehaviors(prev =>
      prev.includes(behavior)
        ? prev.filter(b => b !== behavior)
        : [...prev, behavior]
    );
  };

  const handleStartSession = () => {
    if (selectedPets.length < 2) {
      Alert.alert('Error', 'Please select at least 2 pets for bonding');
      return;
    }
    if (!location) {
      Alert.alert('Error', 'Please select a location for the session');
      return;
    }
    setStartTime(new Date());
    setIsRunning(true);
  };

  const handleEndSession = async () => {
    if (!startTime) return;

    const duration = Math.floor((Date.now() - startTime.getTime()) / (1000 * 60));
    
    // Determine session success based on behaviors
    let success: BondingSession['success'] = 'neutral';
    if (selectedBehaviors.some(b => b === 'Fighting' || b === 'Mounting')) {
      success = 'challenging';
    } else if (selectedBehaviors.some(b => 
      ['Popcorning', 'Sharing Food', 'Grooming', 'Sleeping Together'].includes(b)
    )) {
      success = 'good';
    }

    const session: BondingSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration,
      pets: selectedPets.map(p => p.id),
      location,
      notes: notes.trim() || undefined,
      success,
      behaviors: selectedBehaviors,
    };

    try {
      const savedSessions = await AsyncStorage.getItem('bonding_sessions');
      const sessions = savedSessions ? JSON.parse(savedSessions) : [];
      await AsyncStorage.setItem(
        'bonding_sessions',
        JSON.stringify([session, ...sessions])
      );
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save session:', error);
      Alert.alert('Error', 'Failed to save the bonding session');
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (isRunning) {
              handleBackPress();
            } else {
              navigation.goBack();
            }
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bonding Timer</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Pets</Text>
        <View style={styles.petsContainer}>
          {allPets.map(pet => (
            <Chip
              key={pet.id}
              selected={selectedPets.some(p => p.id === pet.id)}
              onPress={() => togglePet(pet)}
              style={styles.chip}
              selectedColor="#5D4037"
            >
              {pet.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationContainer}>
          {COMMON_LOCATIONS.map(loc => (
            <Chip
              key={loc}
              selected={location === loc}
              onPress={() => setLocation(loc)}
              style={styles.chip}
              selectedColor="#5D4037"
            >
              {loc}
            </Chip>
          ))}
        </View>

        {isRunning && (
          <>
            <Text style={styles.sectionTitle}>Observed Behaviors</Text>
            <View style={styles.behaviorsContainer}>
              {COMMON_BEHAVIORS.map(behavior => (
                <Chip
                  key={behavior}
                  selected={selectedBehaviors.includes(behavior)}
                  onPress={() => toggleBehavior(behavior)}
                  style={styles.chip}
                  selectedColor="#5D4037"
                >
                  {behavior}
                </Chip>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              style={styles.notesInput}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Add any observations or notes about the session..."
            />
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {!isRunning ? (
          <Button
            mode="contained"
            onPress={handleStartSession}
            style={styles.button}
            disabled={selectedPets.length < 2 || !location}
          >
            Start Session
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleEndSession}
            style={[styles.button, { backgroundColor: '#F44336' }]}
          >
            End Session
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFF8E1',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#5D4037',
    fontVariant: ['tabular-nums'],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 12,
    marginTop: 20,
  },
  petsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  behaviorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: 'white',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#5D4037',
  },
});

export default BondingTimerScreen; 