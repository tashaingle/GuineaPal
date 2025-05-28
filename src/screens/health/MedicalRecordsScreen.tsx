import BaseScreen from '@/components/BaseScreen';
import { Medication, RootStackParamList, VetAppointment } from '@/navigation/types';
import colors from '@/theme/colors';
import {
    loadMedications,
    loadVetAppointments,
    saveMedication,
    saveVetAppointment,
    updateMedication,
    updateVetAppointment
} from '@/utils/petStorage';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'medications' | 'visits';

const MedicalRecordsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'MedicalRecords'>>();
  const navigation = useNavigation<NavigationProp>();
  const { petId } = route.params;
  const [pet, setPet] = useState<{ id: string; name: string } | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>('medications');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<VetAppointment | null>(null);

  // Medication form state
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [medNotes, setMedNotes] = useState('');
  const [medReminderEnabled, setMedReminderEnabled] = useState(false);
  const [active, setActive] = useState(true);

  // Appointment form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [vetName, setVetName] = useState('');
  const [clinic, setClinic] = useState('');
  const [aptNotes, setAptNotes] = useState('');
  const [aptReminderEnabled, setAptReminderEnabled] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pets, medsRecords, apptRecords] = await Promise.all([
        loadPets(),
        loadMedications(petId),
        loadVetAppointments(petId)
      ]);
      const currentPet = pets.find(p => p.id === petId);
      if (!currentPet) {
        console.warn(`Pet with ID ${petId} not found, retrying...`);
        // Add a small delay and retry once
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryPets = await loadPets();
        const retryPet = retryPets.find(p => p.id === petId);
        if (!retryPet) {
          throw new Error('Pet not found');
        }
        setPet(retryPet);
      } else {
        setPet(currentPet);
      }
      setMedications(medsRecords.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
      setAppointments(apptRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Failed to load medical records:', error);
      Alert.alert('Error', 'Failed to load medical records. Please try again.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const resetMedicationForm = () => {
    setMedName('');
    setDosage('');
    setFrequency('');
    setStartDate('');
    setEndDate('');
    setMedNotes('');
    setMedReminderEnabled(false);
    setActive(true);
    setEditingMedication(null);
  };

  const resetAppointmentForm = () => {
    setDate('');
    setTime('');
    setPurpose('');
    setVetName('');
    setClinic('');
    setAptNotes('');
    setAptReminderEnabled(true);
    setCompleted(false);
    setEditingAppointment(null);
  };

  const handleSaveMedication = async () => {
    if (!medName || !dosage || !frequency || !startDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!pet) {
      Alert.alert('Error', 'Pet information not found');
      return;
    }

    try {
      const medicationData: Medication = {
        id: editingMedication?.id || Date.now().toString(),
        name: medName,
        dosage,
        frequency,
        startDate,
        endDate: endDate || undefined,
        notes: medNotes.trim() || undefined,
        reminderEnabled: medReminderEnabled,
        active
      };

      if (editingMedication) {
        await updateMedication(petId, medicationData);
        setMedications(medications.map(med => 
          med.id === medicationData.id ? medicationData : med
        ));
      } else {
        await saveMedication(petId, medicationData);
        setMedications([medicationData, ...medications]);
      }

      setShowMedicationModal(false);
      resetMedicationForm();
    } catch (error) {
      console.error('Failed to save medication:', error);
      Alert.alert('Error', 'Failed to save medication');
    }
  };

  const handleSaveAppointment = async () => {
    if (!date || !time || !purpose) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!pet) {
      Alert.alert('Error', 'Pet information not found');
      return;
    }

    try {
      const appointmentData: VetAppointment = {
        id: editingAppointment?.id || Date.now().toString(),
        date,
        time,
        purpose,
        vetName: vetName || undefined,
        clinic: clinic || undefined,
        notes: aptNotes.trim() || undefined,
        reminderEnabled: aptReminderEnabled,
        completed
      };

      if (editingAppointment) {
        await updateVetAppointment(petId, appointmentData);
        setAppointments(appointments.map(apt => 
          apt.id === appointmentData.id ? appointmentData : apt
        ));
      } else {
        await saveVetAppointment(petId, appointmentData);
        setAppointments([appointmentData, ...appointments]);
      }

      setShowAppointmentModal(false);
      resetAppointmentForm();
    } catch (error) {
      console.error('Failed to save appointment:', error);
      Alert.alert('Error', 'Failed to save appointment');
    }
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setMedName(medication.name);
    setDosage(medication.dosage);
    setFrequency(medication.frequency);
    setStartDate(medication.startDate);
    setEndDate(medication.endDate || '');
    setMedNotes(medication.notes || '');
    setMedReminderEnabled(medication.reminderEnabled);
    setActive(medication.active);
    setShowMedicationModal(true);
  };

  const handleEditAppointment = (appointment: VetAppointment) => {
    setEditingAppointment(appointment);
    setDate(appointment.date);
    setTime(appointment.time);
    setPurpose(appointment.purpose);
    setVetName(appointment.vetName || '');
    setClinic(appointment.clinic || '');
    setAptNotes(appointment.notes || '');
    setAptReminderEnabled(appointment.reminderEnabled);
    setCompleted(appointment.completed);
    setShowAppointmentModal(true);
  };

  const renderMedication = ({ item }: { item: Medication }) => (
    <TouchableOpacity 
      style={[styles.recordItem, !item.active && styles.inactiveItem]}
      onPress={() => handleEditMedication(item)}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.recordTitle}>{item.name}</Text>
        {!item.active && (
          <View style={styles.statusTag}>
            <Text style={styles.statusText}>Inactive</Text>
          </View>
        )}
      </View>

      <View style={styles.recordDetails}>
        <Text style={styles.detailText}>Dosage: {item.dosage}</Text>
        <Text style={styles.detailText}>Frequency: {item.frequency}</Text>
        <Text style={styles.detailText}>
          Started: {new Date(item.startDate).toLocaleDateString()}
        </Text>
        {item.endDate && (
          <Text style={styles.detailText}>
            Ended: {new Date(item.endDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      {item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}

      {item.reminderEnabled && (
        <View style={styles.reminderTag}>
          <MaterialIcons name="notifications-active" size={16} color="#5D4037" />
          <Text style={styles.reminderText}>Reminders enabled</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAppointment = ({ item }: { item: VetAppointment }) => (
    <TouchableOpacity 
      style={[styles.recordItem, item.completed && styles.completedItem]}
      onPress={() => handleEditAppointment(item)}
    >
      <View style={styles.recordHeader}>
        <View>
          <Text style={styles.recordTitle}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text style={styles.recordSubtitle}>{item.time}</Text>
        </View>
        {item.completed ? (
          <View style={[styles.statusTag, styles.completedTag]}>
            <MaterialIcons name="check-circle" size={16} color="white" />
            <Text style={[styles.statusText, styles.completedText]}>Completed</Text>
          </View>
        ) : (
          <View style={[styles.statusTag, styles.upcomingTag]}>
            <MaterialIcons name="event" size={16} color="#5D4037" />
            <Text style={[styles.statusText, styles.upcomingText]}>Upcoming</Text>
          </View>
        )}
      </View>

      <Text style={styles.purpose}>{item.purpose}</Text>

      {(item.vetName || item.clinic) && (
        <View style={styles.locationInfo}>
          {item.vetName && (
            <Text style={styles.detailText}>
              <MaterialIcons name="person" size={14} color="#795548" /> {item.vetName}
            </Text>
          )}
          {item.clinic && (
            <Text style={styles.detailText}>
              <MaterialIcons name="local-hospital" size={14} color="#795548" /> {item.clinic}
            </Text>
          )}
        </View>
      )}

      {item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}

      {item.reminderEnabled && !item.completed && (
        <View style={styles.reminderTag}>
          <MaterialIcons name="notifications-active" size={16} color="#5D4037" />
          <Text style={styles.reminderText}>Reminder set</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMedicationModal = () => (
    <Modal
      visible={showMedicationModal}
      transparent
      animationType="slide"
      onRequestClose={() => {
        setShowMedicationModal(false);
        resetMedicationForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMedication ? 'Edit Medication' : 'Add Medication'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowMedicationModal(false);
                resetMedicationForm();
              }}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#5D4037" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.modalScrollContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={medName}
                  onChangeText={setMedName}
                  placeholder="Medication name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Dosage *</Text>
                <TextInput
                  style={styles.input}
                  value={dosage}
                  onChangeText={setDosage}
                  placeholder="e.g., 0.5ml, 1 tablet"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Frequency *</Text>
                <TextInput
                  style={styles.input}
                  value={frequency}
                  onChangeText={setFrequency}
                  placeholder="e.g., Once daily, Twice weekly"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={medNotes}
                  onChangeText={setMedNotes}
                  placeholder="Add any notes about the medication"
                  multiline
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Enable Reminders</Text>
                <Switch
                  value={medReminderEnabled}
                  onValueChange={setMedReminderEnabled}
                  trackColor={{ false: '#E0E0E0', true: '#A1887F' }}
                  thumbColor={medReminderEnabled ? '#5D4037' : '#BDBDBD'}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Active</Text>
                <Switch
                  value={active}
                  onValueChange={setActive}
                  trackColor={{ false: '#E0E0E0', true: '#A1887F' }}
                  thumbColor={active ? '#5D4037' : '#BDBDBD'}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowMedicationModal(false);
                resetMedicationForm();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveMedication}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAppointmentModal = () => (
    <Modal
      visible={showAppointmentModal}
      transparent
      animationType="slide"
      onRequestClose={() => {
        setShowAppointmentModal(false);
        resetAppointmentForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowAppointmentModal(false);
                resetAppointmentForm();
              }}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#5D4037" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.modalScrollContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date *</Text>
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time *</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Purpose *</Text>
                <TextInput
                  style={styles.input}
                  value={purpose}
                  onChangeText={setPurpose}
                  placeholder="e.g., Annual checkup, Dental check"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Vet Name</Text>
                <TextInput
                  style={styles.input}
                  value={vetName}
                  onChangeText={setVetName}
                  placeholder="Veterinarian's name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Clinic</Text>
                <TextInput
                  style={styles.input}
                  value={clinic}
                  onChangeText={setClinic}
                  placeholder="Clinic name or location"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={aptNotes}
                  onChangeText={setAptNotes}
                  placeholder="Add any notes about the appointment"
                  multiline
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Enable Reminders</Text>
                <Switch
                  value={aptReminderEnabled}
                  onValueChange={setAptReminderEnabled}
                  trackColor={{ false: '#E0E0E0', true: '#A1887F' }}
                  thumbColor={aptReminderEnabled ? '#5D4037' : '#BDBDBD'}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Completed</Text>
                <Switch
                  value={completed}
                  onValueChange={setCompleted}
                  trackColor={{ false: '#E0E0E0', true: '#A1887F' }}
                  thumbColor={completed ? '#5D4037' : '#BDBDBD'}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowAppointmentModal(false);
                resetAppointmentForm();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveAppointment}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <BaseScreen
      title={pet ? `${pet.name}'s Medical Records` : 'Medical Records'}
      rightIcon={activeTab === 'medications' ? 'medical-services' : 'event'}
      onRightPress={() => {
        if (activeTab === 'medications') {
          setShowMedicationModal(true);
        } else {
          setShowAppointmentModal(true);
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{pet ? `${pet.name}'s Medical Records` : 'Medical Records'}</Text>
          <Text style={styles.bannerSubtitle}>Track medications and vet visits</Text>
        </View>

        <View style={styles.segmentedContainer}>
          <View style={styles.segmentedButtons}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                activeTab === 'medications' && styles.activeSegment
              ]}
              onPress={() => setActiveTab('medications')}
            >
              <MaterialIcons
                name="medical-services"
                size={20}
                color={activeTab === 'medications' ? 'white' : '#5D4037'}
              />
              <Text style={[
                styles.segmentLabel,
                activeTab === 'medications' && styles.activeLabel
              ]}>
                Medications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                activeTab === 'visits' && styles.activeSegment
              ]}
              onPress={() => setActiveTab('visits')}
            >
              <MaterialIcons
                name="local-hospital"
                size={20}
                color={activeTab === 'visits' ? 'white' : '#5D4037'}
              />
              <Text style={[
                styles.segmentLabel,
                activeTab === 'visits' && styles.activeLabel
              ]}>
                Vet Visits
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'medications' ? (
          <FlatList
            data={medications}
            renderItem={renderMedication}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialIcons name="medical-services" size={48} color="#BDBDBD" />
                <Text style={styles.emptyText}>No medications yet</Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button to add a medication
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={appointments}
            renderItem={renderAppointment}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialIcons name="event" size={48} color="#BDBDBD" />
                <Text style={styles.emptyText}>No vet visits yet</Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button to add a vet visit
                </Text>
              </View>
            }
          />
        )}

        {renderMedicationModal()}
        {renderAppointmentModal()}
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT
  },
  banner: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
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
  content: {
    flex: 1,
    padding: 16
  },
  card: {
    backgroundColor: colors.background.card,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 24,
    margin: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  segmentedContainer: {
    padding: 16
  },
  segmentedButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 8
  },
  activeSegment: {
    backgroundColor: '#5D4037'
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4037'
  },
  activeLabel: {
    color: 'white'
  },
  listContent: {
    padding: 16,
    gap: 16
  },
  recordItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037'
  },
  recordSubtitle: {
    fontSize: 14,
    color: '#795548',
    marginTop: 2
  },
  recordDetails: {
    marginBottom: 8
  },
  detailText: {
    fontSize: 14,
    color: '#795548',
    marginBottom: 4
  },
  notes: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginTop: 8
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#757575'
  },
  completedTag: {
    backgroundColor: '#4CAF50'
  },
  completedText: {
    color: 'white'
  },
  upcomingTag: {
    backgroundColor: '#FFF8E1'
  },
  upcomingText: {
    color: '#5D4037'
  },
  inactiveItem: {
    opacity: 0.7
  },
  completedItem: {
    backgroundColor: '#F5F5F5'
  },
  locationInfo: {
    marginTop: 8
  },
  purpose: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 8
  },
  reminderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  reminderText: {
    fontSize: 12,
    color: '#5D4037',
    marginLeft: 4
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037'
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(93, 64, 55, 0.1)'
  },
  modalScroll: {
    maxHeight: '70%'
  },
  modalScrollContent: {
    padding: 16
  },
  inputContainer: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  switchLabel: {
    fontSize: 16,
    color: '#5D4037'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white'
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 12
  },
  cancelButton: {
    backgroundColor: '#E0E0E0'
  },
  saveButton: {
    backgroundColor: '#5D4037'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  saveButtonText: {
    color: 'white'
  }
});

export default MedicalRecordsScreen; 