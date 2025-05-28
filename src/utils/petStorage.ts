import { CareSchedule, DietPreferences, FeedingSchedule, HealthRecord, Medication, VetAppointment, WeightRecord } from '@/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PETS: '@guinea_pal_pets',
  HEALTH_RECORDS: '@guinea_pal_health_records_',
  MEDICATIONS: '@guinea_pal_medications_',
  VET_APPOINTMENTS: '@guinea_pal_vet_appointments_',
  WEIGHT_RECORDS: '@guinea_pal_weight_records_',
  CARE_SCHEDULE: '@guinea_pal_care_schedule_',
  DIET_PREFERENCES: '@guinea_pal_diet_preferences_',
  FEEDING_SCHEDULE: '@guinea_pal_feeding_schedule_'
};

// Health Records
export const saveHealthRecord = async (petId: string, record: HealthRecord) => {
  const records = await loadHealthRecords(petId);
  const updatedRecords = [...records, record];
  await AsyncStorage.setItem(
    STORAGE_KEYS.HEALTH_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const loadHealthRecords = async (petId: string): Promise<HealthRecord[]> => {
  try {
    const records = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_RECORDS + petId);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Failed to load health records:', error);
    return [];
  }
};

// Medications
export const saveMedication = async (petId: string, medication: Medication) => {
  const medications = await loadMedications(petId);
  const updatedMedications = [...medications, medication];
  await AsyncStorage.setItem(
    STORAGE_KEYS.MEDICATIONS + petId,
    JSON.stringify(updatedMedications)
  );
};

export const loadMedications = async (petId: string): Promise<Medication[]> => {
  try {
    const medications = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATIONS + petId);
    return medications ? JSON.parse(medications) : [];
  } catch (error) {
    console.error('Failed to load medications:', error);
    return [];
  }
};

// Vet Appointments
export const saveVetAppointment = async (petId: string, appointment: VetAppointment) => {
  const appointments = await loadVetAppointments(petId);
  const updatedAppointments = [...appointments, appointment];
  await AsyncStorage.setItem(
    STORAGE_KEYS.VET_APPOINTMENTS + petId,
    JSON.stringify(updatedAppointments)
  );
};

export const loadVetAppointments = async (petId: string): Promise<VetAppointment[]> => {
  try {
    const appointments = await AsyncStorage.getItem(STORAGE_KEYS.VET_APPOINTMENTS + petId);
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error('Failed to load vet appointments:', error);
    return [];
  }
};

// Weight Records
export const saveWeightRecord = async (petId: string, record: WeightRecord) => {
  const records = await loadWeightRecords(petId);
  const updatedRecords = [...records, record];
  await AsyncStorage.setItem(
    STORAGE_KEYS.WEIGHT_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const loadWeightRecords = async (petId: string): Promise<WeightRecord[]> => {
  try {
    const records = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS + petId);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Failed to load weight records:', error);
    return [];
  }
};

export const updateWeightRecord = async (petId: string, updatedRecord: WeightRecord) => {
  const records = await loadWeightRecords(petId);
  const updatedRecords = records.map(record => 
    record.id === updatedRecord.id ? updatedRecord : record
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.WEIGHT_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

// Update functions
export const updateHealthRecord = async (petId: string, updatedRecord: HealthRecord) => {
  const records = await loadHealthRecords(petId);
  const updatedRecords = records.map(record => 
    record.id === updatedRecord.id ? updatedRecord : record
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.HEALTH_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const updateMedication = async (petId: string, updatedMedication: Medication) => {
  const medications = await loadMedications(petId);
  const updatedMedications = medications.map(medication => 
    medication.id === updatedMedication.id ? updatedMedication : medication
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.MEDICATIONS + petId,
    JSON.stringify(updatedMedications)
  );
};

export const updateVetAppointment = async (petId: string, updatedAppointment: VetAppointment) => {
  const appointments = await loadVetAppointments(petId);
  const updatedAppointments = appointments.map(appointment => 
    appointment.id === updatedAppointment.id ? updatedAppointment : appointment
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.VET_APPOINTMENTS + petId,
    JSON.stringify(updatedAppointments)
  );
};

// Delete functions
export const deleteHealthRecord = async (petId: string, recordId: string) => {
  const records = await loadHealthRecords(petId);
  const updatedRecords = records.filter(record => record.id !== recordId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.HEALTH_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const deleteMedication = async (petId: string, medicationId: string) => {
  const medications = await loadMedications(petId);
  const updatedMedications = medications.filter(medication => medication.id !== medicationId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.MEDICATIONS + petId,
    JSON.stringify(updatedMedications)
  );
};

export const deleteVetAppointment = async (petId: string, appointmentId: string) => {
  const appointments = await loadVetAppointments(petId);
  const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.VET_APPOINTMENTS + petId,
    JSON.stringify(updatedAppointments)
  );
};

export const deleteWeightRecord = async (petId: string, recordId: string) => {
  const records = await loadWeightRecords(petId);
  const updatedRecords = records.filter(record => record.id !== recordId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.WEIGHT_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

// Care Schedule
export const saveCareSchedule = async (petId: string, schedule: CareSchedule) => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.CARE_SCHEDULE + petId,
    JSON.stringify(schedule)
  );
};

export const loadCareSchedule = async (petId: string): Promise<CareSchedule | null> => {
  try {
    const schedule = await AsyncStorage.getItem(STORAGE_KEYS.CARE_SCHEDULE + petId);
    return schedule ? JSON.parse(schedule) : null;
  } catch (error) {
    console.error('Failed to load care schedule:', error);
    return null;
  }
};

export const updateCareSchedule = async (petId: string, schedule: CareSchedule) => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.CARE_SCHEDULE + petId,
    JSON.stringify(schedule)
  );
};

// Diet Preferences
export const saveDietPreferences = async (petId: string, preferences: DietPreferences) => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.DIET_PREFERENCES + petId,
    JSON.stringify(preferences)
  );
};

export const loadDietPreferences = async (petId: string): Promise<DietPreferences | null> => {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.DIET_PREFERENCES + petId);
    return preferences ? JSON.parse(preferences) : null;
  } catch (error) {
    console.error('Failed to load diet preferences:', error);
    return null;
  }
};

// Feeding Schedule
export const saveFeedingSchedule = async (petId: string, schedule: FeedingSchedule) => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.FEEDING_SCHEDULE + petId,
    JSON.stringify(schedule)
  );
};

export const loadFeedingSchedule = async (petId: string): Promise<FeedingSchedule | null> => {
  try {
    const schedule = await AsyncStorage.getItem(STORAGE_KEYS.FEEDING_SCHEDULE + petId);
    return schedule ? JSON.parse(schedule) : null;
  } catch (error) {
    console.error('Failed to load feeding schedule:', error);
    return null;
  }
}; 