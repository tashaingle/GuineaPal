import { GuineaPig, PeeColor, PoopColor, PoopConsistency, RootStackParamList, WasteLog } from '@/navigation/types';
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
import { Button, RadioButton, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWasteLog'>;

const POOP_CONSISTENCIES: PoopConsistency[] = ['normal', 'soft', 'wet', 'dry', 'diarrhea'];
const POOP_COLORS: PoopColor[] = ['brown', 'dark_brown', 'green', 'white', 'red', 'black'];
const PEE_COLORS: PeeColor[] = ['clear', 'cloudy', 'dark_yellow', 'orange', 'red', 'brown'];
const PEE_VOLUMES: ('normal' | 'excessive' | 'reduced')[] = ['normal', 'excessive', 'reduced'];

const AddWasteLogScreen = ({ navigation, route }: Props) => {
  const [type, setType] = useState<'poop' | 'pee'>('poop');
  const [frequency, setFrequency] = useState('1');
  const [frequencyType, setFrequencyType] = useState<'per_hour' | 'per_day'>('per_day');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [poopConsistency, setPoopConsistency] = useState<PoopConsistency>('normal');
  const [poopColor, setPoopColor] = useState<PoopColor>('brown');
  const [peeColor, setPeeColor] = useState<PeeColor>('clear');
  const [peeVolume, setPeeVolume] = useState<'normal' | 'excessive' | 'reduced'>('normal');
  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets();

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const pets = await loadPets();
      const pet = pets.find(p => p.id === route.params.petId);

      if (!pet) {
        Alert.alert('Error', 'Pet not found');
        return;
      }

      const newLog: WasteLog = {
        id: Date.now().toString(),
        petId: pet.id,
        date: new Date().toISOString(),
        type,
        frequency: parseInt(frequency, 10),
        frequencyType,
        location,
        notes,
        ...(type === 'poop' ? {
          poopConsistency,
          poopColor,
        } : {
          peeColor,
          peeVolume,
        }),
      };

      const updatedPet: GuineaPig = {
        ...pet,
        wasteLogs: [...(pet.wasteLogs || []), newLog],
      };

      const updatedPets = pets.map(p => p.id === pet.id ? updatedPet : p);
      await savePets(updatedPets);

      route.params.onSave();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save waste log:', error);
      Alert.alert('Error', 'Failed to save waste log');
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabel = (value: string) => {
    return value.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <RadioButton.Group onValueChange={value => setType(value as 'poop' | 'pee')} value={type}>
            <View style={styles.row}>
              <RadioButton.Item label="Poop" value="poop" />
              <RadioButton.Item label="Pee" value="pee" />
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            <TextInput
              value={frequency}
              onChangeText={setFrequency}
              keyboardType="numeric"
              style={[styles.input, styles.frequencyInput]}
              mode="outlined"
            />
            <View style={styles.frequencyTypeContainer}>
              <RadioButton.Group onValueChange={value => setFrequencyType(value as 'per_hour' | 'per_day')} value={frequencyType}>
                <View style={styles.row}>
                  <RadioButton.Item label="Per Hour" value="per_hour" />
                  <RadioButton.Item label="Per Day" value="per_day" />
                </View>
              </RadioButton.Group>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            mode="outlined"
            placeholder="e.g., Cage corner, Floor time area"
          />
        </View>

        {type === 'poop' ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Consistency</Text>
              <RadioButton.Group onValueChange={value => setPoopConsistency(value as PoopConsistency)} value={poopConsistency}>
                {POOP_CONSISTENCIES.map(consistency => (
                  <RadioButton.Item
                    key={consistency}
                    label={formatLabel(consistency)}
                    value={consistency}
                  />
                ))}
              </RadioButton.Group>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <RadioButton.Group onValueChange={value => setPoopColor(value as PoopColor)} value={poopColor}>
                {POOP_COLORS.map(color => (
                  <RadioButton.Item
                    key={color}
                    label={formatLabel(color)}
                    value={color}
                  />
                ))}
              </RadioButton.Group>
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <RadioButton.Group onValueChange={value => setPeeColor(value as PeeColor)} value={peeColor}>
                {PEE_COLORS.map(color => (
                  <RadioButton.Item
                    key={color}
                    label={formatLabel(color)}
                    value={color}
                  />
                ))}
              </RadioButton.Group>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Volume</Text>
              <RadioButton.Group onValueChange={value => setPeeVolume(value as 'normal' | 'excessive' | 'reduced')} value={peeVolume}>
                {PEE_VOLUMES.map(volume => (
                  <RadioButton.Item
                    key={volume}
                    label={formatLabel(volume)}
                    value={volume}
                  />
                ))}
              </RadioButton.Group>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Any additional observations..."
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          style={styles.saveButton}
        >
          Save Log
        </Button>
      </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
  },
  saveButton: {
    marginVertical: 24,
    backgroundColor: '#5D4037',
  },
  frequencyContainer: {
    marginBottom: 12,
  },
  frequencyInput: {
    marginBottom: 8,
  },
  frequencyTypeContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    marginTop: 8,
  },
});

export default AddWasteLogScreen; 