import { BondingSession, GuineaPig, RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card, Chip, FAB, Portal, Provider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'BondingTracker'>;

interface BondingTrackerParams {
  petId?: string;
}

const BEHAVIOR_EMOJIS = {
  'Popcorning': '🦘',
  'Rumbling': '😤',
  'Chasing': '🏃',
  'Mounting': '⚠️',
  'Fighting': '⚔️',
  'Sharing Food': '🥕',
  'Grooming': '✨',
  'Sleeping Together': '💤',
  'Chatting': '💭',
};

const COMMON_LOCATIONS = [
  'Playpen',
  'Floor Time',
  'Neutral Space',
  'Main Cage',
  'Outside',
];

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

const BondingTrackerScreen = ({ navigation, route }: Props) => {
  const [sessions, setSessions] = useState<BondingSession[]>([]);
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<BondingSession | null>(null);
  const [editLocation, setEditLocation] = useState('');
  const [editBehaviors, setEditBehaviors] = useState<string[]>([]);
  const [editNotes, setEditNotes] = useState('');
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [savedSessions, savedPets] = await Promise.all([
        AsyncStorage.getItem('bonding_sessions'),
        loadPets(),
      ]);

      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
      setPets(savedPets);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load bonding sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const getPetNames = (petIds: string[]) => {
    return petIds
      .map(id => pets.find(p => p.id === id)?.name || 'Unknown')
      .join(' & ');
  };

  const getSuccessColor = (success: BondingSession['success']) => {
    switch (success) {
      case 'good':
        return colors.buttons.green;
      case 'neutral':
        return colors.buttons.orange;
      case 'challenging':
        return colors.buttons.red;
      default:
        return colors.text.secondary;
    }
  };

  const startEditing = (session: BondingSession) => {
    setEditingSession(session);
    setEditLocation(session.location);
    setEditBehaviors(session.behaviors);
    setEditNotes(session.notes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingSession) return;

    try {
      const updatedSession = {
        ...editingSession,
        location: editLocation,
        behaviors: editBehaviors,
        notes: editNotes.trim() || undefined,
      };

      // Determine session success based on behaviors
      let success: BondingSession['success'] = 'neutral';
      if (editBehaviors.some(b => b === 'Fighting' || b === 'Mounting')) {
        success = 'challenging';
      } else if (editBehaviors.some(b => 
        ['Popcorning', 'Sharing Food', 'Grooming', 'Sleeping Together'].includes(b)
      )) {
        success = 'good';
      }
      updatedSession.success = success;

      const updatedSessions = sessions.map(s =>
        s.id === editingSession.id ? updatedSession : s
      );

      await AsyncStorage.setItem('bonding_sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      setEditingSession(null);
    } catch (err) {
      console.error('Failed to update session:', err);
      Alert.alert('Error', 'Failed to update the session. Please try again.');
    }
  };

  const toggleEditBehavior = (behavior: string) => {
    setEditBehaviors(prev =>
      prev.includes(behavior)
        ? prev.filter(b => b !== behavior)
        : [...prev, behavior]
    );
  };

  const renderEditModal = () => {
    if (!editingSession) return null;

    return (
      <Modal
        visible={!!editingSession}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditingSession(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Session</Text>
              <TouchableOpacity
                onPress={() => setEditingSession(null)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.chipContainer}>
              {COMMON_LOCATIONS.map(loc => (
                <Chip
                  key={loc}
                  selected={editLocation === loc}
                  onPress={() => setEditLocation(loc)}
                  style={styles.chip}
                  selectedColor={colors.accent.primary}
                >
                  {loc}
                </Chip>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Behaviors</Text>
            <View style={styles.chipContainer}>
              {COMMON_BEHAVIORS.map(behavior => (
                <Chip
                  key={behavior}
                  selected={editBehaviors.includes(behavior)}
                  onPress={() => toggleEditBehavior(behavior)}
                  style={styles.chip}
                  selectedColor={colors.accent.primary}
                >
                  {BEHAVIOR_EMOJIS[behavior as keyof typeof BEHAVIOR_EMOJIS]} {behavior}
                </Chip>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              value={editNotes}
              onChangeText={setEditNotes}
              style={styles.notesInput}
              multiline
              numberOfLines={4}
              placeholder="Add any observations or notes about the session..."
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSession = ({ item }: { item: BondingSession }) => (
    <Card style={styles.sessionCard}>
      <Card.Content>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => startEditing(item)}
              style={styles.editButton}
            >
              <MaterialIcons name="edit" size={20} color={colors.accent.primary} />
            </TouchableOpacity>
            <View
              style={[
                styles.successIndicator,
                { backgroundColor: getSuccessColor(item.success) },
              ]}
            />
          </View>
        </View>

        <Text style={styles.petsNames}>{getPetNames(item.pets)}</Text>
        <Text style={styles.duration}>{item.duration} minutes</Text>
        
        {item.location && (
          <View style={styles.locationContainer}>
            <MaterialIcons name="place" size={16} color={colors.text.secondary} />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}

        <View style={styles.behaviorsContainer}>
          {item.behaviors.map(behavior => (
            <View key={behavior} style={styles.behaviorChip}>
              <Text style={styles.behaviorText}>
                {BEHAVIOR_EMOJIS[behavior as keyof typeof BEHAVIOR_EMOJIS]} {behavior}
              </Text>
            </View>
          ))}
        </View>

        {item.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  const startNewSession = () => {
    if (pets.length < 2) {
      Alert.alert(
        'Not Enough Pets',
        'You need at least 2 guinea pigs to start a bonding session. Add more pets first!'
      );
      return;
    }

    navigation.navigate('BondingTimer', {
      pets: route.params?.petId ? [route.params.petId] : [],
    });
  };

  return (
    <Provider>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={[styles.header, { 
          backgroundColor: colors.white,
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 12,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.accent.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Bonding Tracker</Text>
          <TouchableOpacity
            style={[styles.guideButton, { backgroundColor: colors.accent.primary + '15' }]}
            onPress={() => navigation.navigate('BondingGuide')}
          >
            <MaterialIcons name="help-outline" size={20} color={colors.accent.primary} />
            <Text style={[styles.guideButtonText, { color: colors.accent.primary }]}>Bonding Guide</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="pets" size={48} color={colors.text.secondary} />
              <Text style={[styles.emptyText, { color: colors.text.primary }]}>No bonding sessions yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
                Start a new session to track your pets' bonding progress
              </Text>
            </View>
          }
        />

        <Portal>
          <FAB
            icon="plus"
            label="New Session"
            style={[styles.fab, { bottom: insets.bottom + 16, backgroundColor: colors.accent.primary }]}
            onPress={startNewSession}
            color="white"
          />
        </Portal>

        {renderEditModal()}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  guideButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  sessionCard: {
    marginBottom: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  successIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  petsNames: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  duration: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.text.secondary,
  },
  behaviorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  behaviorChip: {
    backgroundColor: colors.accent.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  behaviorText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  notes: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    margin: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  notesInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.accent.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  chip: {
    marginBottom: 8,
  },
});

export default BondingTrackerScreen; 