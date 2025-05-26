import { RootStackParamList, WasteLog, WasteType } from '@/navigation/types';
import { loadPets, savePets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, Chip, SegmentedButtons, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWasteLog'>;

const POOP_CONSISTENCIES = [
  { label: 'Normal', value: 'normal' },
  { label: 'Soft', value: 'soft' },
  { label: 'Wet', value: 'wet' },
  { label: 'Dry', value: 'dry' },
  { label: 'Diarrhea', value: 'diarrhea' },
];

const POOP_COLOURS = [
  { label: 'Brown', value: 'brown' },
  { label: 'Dark Brown', value: 'dark_brown' },
  { label: 'Green', value: 'green' },
  { label: 'White', value: 'white' },
  { label: 'Red', value: 'red' },
  { label: 'Black', value: 'black' },
];

const PEE_COLOURS = [
  { label: 'Clear', value: 'clear' },
  { label: 'Cloudy', value: 'cloudy' },
  { label: 'Dark Yellow', value: 'dark_yellow' },
  { label: 'Orange', value: 'orange' },
  { label: 'Red', value: 'red' },
  { label: 'Brown', value: 'brown' },
];

const POOP_FREQUENCY_RANGES = [
  { label: '0-10', value: '5' },
  { label: '10-20', value: '15' },
  { label: '20-30', value: '25' },
  { label: '30+', value: '35' },
];

const PEE_VOLUMES = [
  { label: 'Normal', value: 'normal' },
  { label: 'Excessive', value: 'excessive' },
  { label: 'Reduced', value: 'reduced' },
];

const COMMON_LOCATIONS = [
  'Cage Corner',
  'Hay Area',
  'Hide House',
  'Floor Time',
  'Other',
];

const AddWasteLogScreen = ({ navigation, route }: Props) => {
  const [type, setType] = useState<WasteType>('poop');
  const [frequency, setFrequency] = useState('5');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  // Poop specific
  const [poopConsistency, setPoopConsistency] = useState('normal');
  const [poopColour, setPoopColour] = useState('brown');
  // Pee specific
  const [peeColour, setPeeColour] = useState('clear');
  const [peeVolume, setPeeVolume] = useState('normal');
  const [customFrequency, setCustomFrequency] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const newLog: WasteLog = {
        id: Date.now().toString(),
        petId: route.params.petId,
        date: new Date().toISOString(),
        type,
        frequency: type === 'poop' ? parseInt(frequency, 10) : parseInt(customFrequency || '1', 10),
        location,
        notes: notes.trim() || undefined,
        ...(type === 'poop' ? {
          poopConsistency,
          poopColor: poopColour,
        } : {
          peeColor: peeColour,
          peeVolume,
        }),
      };

      const pets = await loadPets();
      const petIndex = pets.findIndex(p => p.id === route.params.petId);
      
      if (petIndex === -1) {
        throw new Error('Pet not found');
      }

      const updatedPet = {
        ...pets[petIndex],
        wasteLogs: [newLog, ...(pets[petIndex].wasteLogs || [])],
      };

      pets[petIndex] = updatedPet;
      await savePets(pets);

      route.params.onSave?.();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save waste log:', error);
      Alert.alert('Error', 'Failed to save the waste log');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Waste Log</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Type</Text>
        <SegmentedButtons
          value={type}
          onValueChange={value => setType(value as WasteType)}
          buttons={[
            { value: 'poop', label: 'Poop 💩' },
            { value: 'pee', label: 'Pee 💧' },
          ]}
          style={styles.segmentedButtons}
        />

        <Text style={styles.sectionTitle}>Frequency</Text>
        {type === 'poop' ? (
          <View style={styles.frequencyContainer}>
            <SegmentedButtons
              value={frequency}
              onValueChange={setFrequency}
              buttons={POOP_FREQUENCY_RANGES}
              style={styles.segmentedButtons}
            />
          </View>
        ) : (
          <TextInput
            value={customFrequency}
            onChangeText={setCustomFrequency}
            keyboardType="number-pad"
            style={styles.input}
            mode="outlined"
            placeholder="How many times?"
          />
        )}

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.chipsContainer}>
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

        {type === 'poop' ? (
          <>
            <Text style={styles.sectionTitle}>Consistency</Text>
            <SegmentedButtons
              value={poopConsistency}
              onValueChange={setPoopConsistency}
              buttons={POOP_CONSISTENCIES}
              style={styles.segmentedButtons}
            />

            <Text style={styles.sectionTitle}>Colour</Text>
            <SegmentedButtons
              value={poopColour}
              onValueChange={setPoopColour}
              buttons={POOP_COLOURS}
              style={styles.segmentedButtons}
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Colour</Text>
            <SegmentedButtons
              value={peeColour}
              onValueChange={setPeeColour}
              buttons={PEE_COLOURS}
              style={styles.segmentedButtons}
            />

            <Text style={styles.sectionTitle}>Volume</Text>
            <SegmentedButtons
              value={peeVolume}
              onValueChange={setPeeVolume}
              buttons={PEE_VOLUMES}
              style={styles.segmentedButtons}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
          placeholder="Add any additional observations..."
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={isSubmitting}
          disabled={isSubmitting || (type === 'pee' && (!customFrequency || parseInt(customFrequency, 10) < 1))}
        >
          Save Log
        </Button>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 12,
    marginTop: 20,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  frequencyContainer: {
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    marginBottom: 8,
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

export default AddWasteLogScreen; 