import BaseScreen from '@/components/BaseScreen';
import { GuineaPig, Mood, MoodEntry, RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { loadPets, savePets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Card } from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'MoodTracker'>;

const MOODS: Record<Mood, { icon: keyof typeof MaterialIcons.glyphMap; color: string; label: string }> = {
  happy: { icon: 'sentiment-very-satisfied', color: '#4CAF50', label: 'Happy' },
  content: { icon: 'sentiment-satisfied', color: '#8BC34A', label: 'Content' },
  neutral: { icon: 'sentiment-neutral', color: '#FFC107', label: 'Neutral' },
  anxious: { icon: 'sentiment-dissatisfied', color: '#FF9800', label: 'Anxious' },
  sad: { icon: 'sentiment-very-dissatisfied', color: '#F44336', label: 'Sad' }
};

const ACTIVITIES: Array<{
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}> = [
  { id: 'eating', label: 'Eating Well', icon: 'restaurant' },
  { id: 'playing', label: 'Playing', icon: 'toys' },
  { id: 'sleeping', label: 'Sleeping', icon: 'bedtime' },
  { id: 'grooming', label: 'Grooming', icon: 'brush' },
  { id: 'socializing', label: 'Socializing', icon: 'groups' },
  { id: 'exploring', label: 'Exploring', icon: 'explore' }
];

const MoodTrackerScreen = ({ route, navigation }: Props) => {
  const { petId } = route.params;
  const [pet, setPet] = useState<GuineaPig | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(true);

  useEffect(() => {
    loadPetData();
  }, []);

  const loadPetData = async () => {
    try {
      const pets = await loadPets();
      const currentPet = pets.find(p => p.id === petId);
      if (!currentPet) {
        Alert.alert('Error', 'Pet not found');
        navigation.goBack();
        return;
      }
      setPet(currentPet);
      if (currentPet.moodHistory) {
        setMoodHistory(currentPet.moodHistory);
      }
    } catch (error) {
      console.error('Failed to load pet data:', error);
      Alert.alert('Error', 'Failed to load pet data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSave = async () => {
    if (!selectedMood || !pet) {
      Alert.alert('Select Mood', 'Please select a mood before saving.');
      return;
    }

    try {
      const moodEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: selectedMood,
        activities: selectedActivities,
        photo: photo || undefined
      };

      const pets = await loadPets();
      const updatedPet = pets.find(p => p.id === petId);
      
      if (updatedPet) {
        updatedPet.moodHistory = [
          ...(updatedPet.moodHistory || []),
          moodEntry
        ];
        await savePets(pets);
        setMoodHistory(updatedPet.moodHistory);
        Alert.alert('Success', 'Mood entry saved successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      Alert.alert('Error', 'Failed to save mood entry. Please try again.');
    }
  };

  const getMarkedDates = () => {
    const markedDates: any = {};
    moodHistory.forEach(entry => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      const mood = MOODS[entry.mood as keyof typeof MOODS];
      markedDates[date] = {
        marked: true,
        dotColor: mood.color
      };
    });
    return markedDates;
  };

  const handleDayPress = (day: DateData) => {
    const entry = moodHistory.find(e => 
      new Date(e.date).toISOString().split('T')[0] === day.dateString
    );
    if (entry) {
      setSelectedEntry(entry);
      setSelectedDate(day.dateString);
    }
  };

  const renderEntryDetails = () => {
    if (!selectedEntry) return null;

    const mood = MOODS[selectedEntry.mood as keyof typeof MOODS];
    const entryDate = new Date(selectedEntry.date).toLocaleDateString();
    const entryActivities = ACTIVITIES.filter(a => selectedEntry.activities.includes(a.id));

    return (
      <View style={styles.entryDetails}>
        <Text style={styles.entryDate}>{entryDate}</Text>
        <View style={styles.entryMood}>
          <MaterialIcons name={mood.icon} size={32} color={mood.color} />
          <Text style={[styles.entryMoodText, { color: mood.color }]}>{mood.label}</Text>
        </View>
        {entryActivities.length > 0 && (
          <View style={styles.entryActivities}>
            <Text style={styles.entryActivitiesTitle}>Activities:</Text>
            {entryActivities.map(activity => (
              <View key={activity.id} style={styles.entryActivity}>
                <MaterialIcons name={activity.icon} size={20} color="#5D4037" />
                <Text style={styles.entryActivityText}>{activity.label}</Text>
              </View>
            ))}
          </View>
        )}
        {selectedEntry.photo && (
          <Image
            source={{ uri: selectedEntry.photo }}
            style={styles.entryPhoto}
            contentFit="cover"
          />
        )}
      </View>
    );
  };

  if (isLoading || !pet) {
    return (
      <BaseScreen title="Loading...">
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen
      title={pet ? `${pet.name}'s Mood Tracker` : 'Mood Tracker'}
      rightIcon="check"
      onRightPress={handleSave}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Mood Tracker</Text>
          <Text style={styles.bannerSubtitle}>Track your pet's daily moods and activities</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={getMarkedDates()}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: '#5D4037',
              todayTextColor: '#5D4037',
              dotColor: '#5D4037',
              arrowColor: '#5D4037',
              monthTextColor: '#5D4037',
              textMonthFontSize: 16,
              textMonthFontWeight: 'bold',
            }}
          />
        </View>

        {selectedEntry ? (
          <View style={styles.entryDetails}>
            {renderEntryDetails()}
            <TouchableOpacity
              onPress={() => {
                setSelectedEntry(null);
                setSelectedDate(null);
                setShowAddForm(true);
              }}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add New Entry</Text>
            </TouchableOpacity>
          </View>
        ) : showAddForm ? (
          <>
            <Card style={styles.card}>
              <Card.Title title="How is your guinea pig feeling?" />
              <Card.Content>
                <View style={styles.moodSelector}>
                  {Object.entries(MOODS).map(([mood, { icon, color, label }]) => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        styles.moodOption,
                        selectedMood === mood && styles.selectedMoodOption,
                        { borderColor: color }
                      ]}
                      onPress={() => setSelectedMood(mood as Mood)}
                    >
                      <MaterialIcons
                        name={icon}
                        size={32}
                        color={selectedMood === mood ? color : '#757575'}
                      />
                      <Text style={styles.moodLabel}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="What activities?" />
              <Card.Content>
                <View style={styles.activitiesGrid}>
                  {ACTIVITIES.map(activity => (
                    <TouchableOpacity
                      key={activity.id}
                      style={[
                        styles.activityOption,
                        selectedActivities.includes(activity.id) && styles.selectedActivity
                      ]}
                      onPress={() => toggleActivity(activity.id)}
                    >
                      <MaterialIcons
                        name={activity.icon}
                        size={24}
                        color={selectedActivities.includes(activity.id) ? '#5D4037' : '#757575'}
                      />
                      <Text style={styles.activityLabel}>{activity.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Add a photo (optional)" />
              <Card.Content>
                <TouchableOpacity
                  style={styles.photoContainer}
                  onPress={handlePhotoSelect}
                >
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      style={styles.photo}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <MaterialIcons name="add-a-photo" size={32} color="#BDBDBD" />
                      <Text style={styles.photoPlaceholderText}>Tap to add photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => setShowAddForm(true)}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>Add New Entry</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    padding: 16,
    gap: 16
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5D4037',
    fontWeight: '500'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT
  },
  modalContent: {
    flex: 1,
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(93, 64, 55, 0.1)',
    backgroundColor: colors.background.DEFAULT
  },
  modalTitleContainer: {
    flex: 1
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5D4037'
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#795548',
    marginTop: 2
  },
  closeButton: {
    margin: 0,
    backgroundColor: 'rgba(93, 64, 55, 0.1)',
    borderRadius: 20
  },
  entryDetails: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4037',
    marginBottom: 8
  },
  entryMood: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  entryMoodText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  entryActivities: {
    marginTop: 8
  },
  entryActivitiesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4037',
    marginBottom: 8
  },
  entryActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  entryActivityText: {
    marginLeft: 8,
    color: '#5D4037'
  },
  entryPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12
  },
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: '18%'
  },
  selectedMoodOption: {
    backgroundColor: '#FFF8E1'
  },
  moodLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#757575'
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  activityOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    minWidth: '30%'
  },
  selectedActivity: {
    backgroundColor: '#FFF8E1'
  },
  activityLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#757575',
    textAlign: 'center'
  },
  photoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5'
  },
  photo: {
    width: '100%',
    height: '100%'
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#BDBDBD'
  },
  banner: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#795548',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#5D4037',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MoodTrackerScreen; 