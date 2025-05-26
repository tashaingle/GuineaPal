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
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card, FAB, Portal, Provider } from 'react-native-paper';
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

const BondingTrackerScreen = ({ navigation, route }: Props) => {
  const [sessions, setSessions] = useState<BondingSession[]>([]);
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        return '#4CAF50';
      case 'neutral':
        return '#FF9800';
      case 'challenging':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderSession = ({ item }: { item: BondingSession }) => (
    <Card style={styles.sessionCard}>
      <Card.Content>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <View
            style={[
              styles.successIndicator,
              { backgroundColor: getSuccessColor(item.success) },
            ]}
          />
        </View>

        <Text style={styles.petsNames}>{getPetNames(item.pets)}</Text>
        <Text style={styles.duration}>{item.duration} minutes</Text>
        
        {item.location && (
          <View style={styles.locationContainer}>
            <MaterialIcons name="place" size={16} color="#757575" />
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
        <View style={[styles.header, { backgroundColor: colors.buttons.pink + '10' }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.pink} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.buttons.pink }]}>Bonding Tracker</Text>
          <TouchableOpacity
            style={[styles.guideButton, { backgroundColor: colors.buttons.pink + '20' }]}
            onPress={() => navigation.navigate('BondingGuide')}
          >
            <MaterialIcons name="help-outline" size={20} color={colors.buttons.pink} />
            <Text style={[styles.guideButtonText, { color: colors.buttons.pink }]}>Bonding Guide</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="pets" size={48} color={colors.buttons.pink + '60'} />
              <Text style={[styles.emptyText, { color: colors.buttons.pink }]}>No bonding sessions yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.buttons.pink + '99' }]}>
                Start a new session to track your pets' bonding progress
              </Text>
            </View>
          }
        />

        <Portal>
          <FAB
            icon="plus"
            label="New Session"
            style={[styles.fab, { bottom: insets.bottom + 16, backgroundColor: colors.buttons.pink }]}
            onPress={startNewSession}
            color="white"
          />
        </Portal>
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
    color: colors.buttons.pink,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.buttons.pink + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  guideButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.buttons.pink,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  sessionCard: {
    marginBottom: 16,
    backgroundColor: colors.buttons.pink + '10',
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
    color: colors.buttons.pink + '99',
  },
  successIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  petsNames: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.buttons.pink,
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: colors.buttons.pink + '99',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.buttons.pink + '80',
  },
  behaviorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  behaviorChip: {
    backgroundColor: colors.buttons.pink + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  behaviorText: {
    fontSize: 14,
    color: colors.buttons.pink,
  },
  notes: {
    fontSize: 14,
    color: colors.buttons.pink + '99',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#5D4037',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#795548',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#5D4037',
  },
});

export default BondingTrackerScreen; 