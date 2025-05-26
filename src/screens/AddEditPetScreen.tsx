import { usePets } from '@/contexts/PetContext';
import { GuineaPig, RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditPet'>;

type Gender = 'male' | 'female' | 'unknown';

const GENDER_OPTIONS: { label: string; value: Gender; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { label: 'Male', value: 'male', icon: 'person' },
  { label: 'Female', value: 'female', icon: 'person-outline' },
  { label: 'Unknown', value: 'unknown', icon: 'help' }
];

const AddEditPetScreen = ({ route, navigation }: Props) => {
  const { mode = 'add', pet, onComplete } = route.params;
  const { addPet, updatePet, deletePet } = usePets();
  const [name, setName] = useState(pet?.name || '');
  const [breed, setBreed] = useState(pet?.breed || '');
  const [birthDate, setBirthDate] = useState<string>(pet?.birthDate || '');
  const [weight, setWeight] = useState(pet?.weight?.toString() || '');
  const [image, setImage] = useState(pet?.image || '');
  const [gender, setGender] = useState<Gender>(pet?.gender || 'unknown');
  const [isPregnant, setIsPregnant] = useState(pet?.isPregnant || false);
  const [pregnancyStartDate, setPregnancyStartDate] = useState<string>(pet?.pregnancyStartDate || '');
  const [expectedDueDate, setExpectedDueDate] = useState<string>(pet?.expectedDueDate || '');
  const [pregnancyNotes, setPregnancyNotes] = useState(pet?.pregnancyNotes || '');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showPregnancyDatePicker, setShowPregnancyDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'birthDate' | 'pregnancyStart'>('birthDate');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (pregnancyStartDate) {
      const startDate = new Date(pregnancyStartDate);
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + 70); // Average 70 days gestation
      const dueDateString = dueDate.toISOString().split('T')[0];
      if (dueDateString) {
        setExpectedDueDate(dueDateString);
      }
    }
  }, [pregnancyStartDate]);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to add a pet photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentMode = datePickerMode;
    setShowDatePicker(false);
    setShowPregnancyDatePicker(false);

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (formattedDate) {
        if (currentMode === 'birthDate') {
          setBirthDate(formattedDate);
        } else {
          setPregnancyStartDate(formattedDate);
        }
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your guinea pig');
      return;
    }

    try {
      setIsLoading(true);
      const petData: GuineaPig = {
        id: pet?.id || Date.now().toString(),
        name: name.trim(),
        breed,
        birthDate,
        weight: weight ? parseFloat(weight) : undefined,
        image,
        gender,
        createdAt: pet?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(gender === 'female' && isPregnant ? {
          isPregnant,
          pregnancyStartDate,
          expectedDueDate,
          pregnancyNotes
        } : {})
      };

      if (mode === 'add') {
        await addPet(petData);
      } else {
        await updatePet(petData);
      }

      if (onComplete) {
        onComplete();
      }
      navigation.goBack();
    } catch (err) {
      console.error('Failed to save pet:', err);
      Alert.alert('Error', 'Failed to save pet information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreedSelect = () => {
    navigation.navigate('BreedSelection', {
      petId: pet?.id || Date.now().toString(),
      currentBreed: breed,
      onSelectBreed: (selectedBreed: string) => setBreed(selectedBreed),
      allowCustomBreeds: true
    });
  };

  const handleDelete = async () => {
    if (!pet?.id) {
      Alert.alert('Error', 'Cannot delete pet: ID not found');
      return;
    }

    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await deletePet(pet.id);
              if (onComplete) {
                onComplete();
              }
              navigation.goBack();
            } catch (err) {
              console.error('Failed to delete pet:', err);
              Alert.alert('Error', 'Failed to delete pet. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {mode === 'add' ? 'Add New Guinea Pig' : 'Edit Guinea Pig'}
            </Text>
            {mode === 'edit' && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
                disabled={isLoading}
              >
                <MaterialIcons name="delete" size={24} color={colors.buttons.red} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView style={styles.content}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleImagePick}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.petImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="add-a-photo" size={40} color={colors.text.light} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />

          <TouchableOpacity
            style={styles.breedSelector}
            onPress={handleBreedSelect}
          >
            <Text style={styles.breedLabel}>Breed</Text>
            <Text style={styles.breedValue}>
              {breed || 'Select breed'}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => {
              setDatePickerMode('birthDate');
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateLabel}>Birth Date</Text>
            <Text style={styles.dateValue}>
              {birthDate ? new Date(birthDate).toLocaleDateString() : 'Select date'}
            </Text>
            <MaterialIcons name="event" size={24} color={colors.text.light} />
          </TouchableOpacity>

          <TextInput
            label="Weight (g)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <TouchableOpacity
            style={styles.genderSelector}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={styles.genderLabel}>Gender</Text>
            <View style={styles.genderValue}>
              <MaterialIcons
                name={GENDER_OPTIONS.find(g => g.value === gender)?.icon || 'help'}
                size={24}
                color={colors.text.light}
              />
              <Text style={styles.genderText}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>

          {gender === 'female' && (
            <View style={styles.pregnancySection}>
              <View style={styles.pregnancyHeader}>
                <Text style={styles.sectionTitle}>Pregnancy Information</Text>
                <TouchableOpacity
                  style={styles.pregnancyToggle}
                  onPress={() => setIsPregnant(!isPregnant)}
                >
                  <MaterialIcons
                    name={isPregnant ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={colors.buttons.purple}
                  />
                  <Text style={styles.pregnancyToggleText}>Is Pregnant</Text>
                </TouchableOpacity>
              </View>

              {isPregnant && (
                <>
                  <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => {
                      setDatePickerMode('pregnancyStart');
                      setShowPregnancyDatePicker(true);
                    }}
                  >
                    <Text style={styles.dateLabel}>Pregnancy Start Date</Text>
                    <Text style={styles.dateValue}>
                      {pregnancyStartDate ? new Date(pregnancyStartDate).toLocaleDateString() : 'Select date'}
                    </Text>
                    <MaterialIcons name="event" size={24} color={colors.text.light} />
                  </TouchableOpacity>

                  {expectedDueDate && (
                    <View style={styles.dueDateContainer}>
                      <Text style={styles.dueDateLabel}>Expected Due Date:</Text>
                      <Text style={styles.dueDateValue}>
                        {new Date(expectedDueDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}

                  <TextInput
                    label="Pregnancy Notes"
                    value={pregnancyNotes}
                    onChangeText={setPregnancyNotes}
                    style={[styles.input, styles.notesInput]}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                  />
                </>
              )}
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
            style={styles.saveButton}
          >
            {mode === 'add' ? 'Add Guinea Pig' : 'Save Changes'}
          </Button>
        </View>

        {Platform.OS === 'ios' ? (
          (showDatePicker || showPregnancyDatePicker) && (
            <Modal
              visible={showDatePicker || showPregnancyDatePicker}
              transparent
              animationType="slide"
            >
              <View style={styles.datePickerModal}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity 
                    onPress={() => {
                      setShowDatePicker(false);
                      setShowPregnancyDatePicker(false);
                    }}
                  >
                    <Text style={styles.datePickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      if (datePickerMode === 'birthDate' && birthDate) {
                        setShowDatePicker(false);
                      } else if (datePickerMode === 'pregnancyStart' && pregnancyStartDate) {
                        setShowPregnancyDatePicker(false);
                      }
                    }}
                  >
                    <Text style={styles.datePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={
                    datePickerMode === 'birthDate'
                      ? (birthDate ? new Date(birthDate) : new Date())
                      : (pregnancyStartDate ? new Date(pregnancyStartDate) : new Date())
                  }
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  style={styles.datePickerIOS}
                />
              </View>
            </Modal>
          )
        ) : (
          (showDatePicker || showPregnancyDatePicker) && (
            <DateTimePicker
              value={
                datePickerMode === 'birthDate'
                  ? (birthDate ? new Date(birthDate) : new Date())
                  : (pregnancyStartDate ? new Date(pregnancyStartDate) : new Date())
              }
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )
        )}

        <Modal
          visible={showGenderModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    gender === option.value && styles.selectedGenderOption
                  ]}
                  onPress={() => {
                    setGender(option.value);
                    setShowGenderModal(false);
                    if (option.value !== 'female') {
                      setIsPregnant(false);
                      setPregnancyStartDate('');
                      setExpectedDueDate('');
                      setPregnancyNotes('');
                    }
                  }}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={24}
                    color={gender === option.value ? colors.white : colors.text.primary}
                  />
                  <Text style={[
                    styles.genderOptionText,
                    gender === option.value && styles.selectedGenderOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
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
    backgroundColor: colors.white,
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
    color: colors.text.primary,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text.light,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  breedSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  breedLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginRight: 8,
  },
  breedValue: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  dateLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginRight: 8,
  },
  dateValue: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
  },
  genderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  genderLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginRight: 8,
  },
  genderValue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.secondary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  saveButton: {
    backgroundColor: colors.buttons.green,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  selectedGenderOption: {
    backgroundColor: colors.buttons.blue,
  },
  genderOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  selectedGenderOptionText: {
    color: colors.white,
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerHeader: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  datePickerCancel: {
    color: colors.buttons.red,
    fontSize: 16,
  },
  datePickerDone: {
    color: colors.buttons.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerIOS: {
    backgroundColor: colors.white,
    height: 260,
  },
  pregnancySection: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
  },
  pregnancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  pregnancyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pregnancyToggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  dueDateLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginRight: 8,
  },
  dueDateValue: {
    fontSize: 16,
    color: colors.buttons.purple,
    fontWeight: '600',
  },
  notesInput: {
    marginTop: 12,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddEditPetScreen;