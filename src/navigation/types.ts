import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown',
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export type HealthTabType = 'weight' | 'medication' | 'appointments' | 'notes' | 'waste';

export type Mood = 'happy' | 'content' | 'neutral' | 'anxious' | 'sad';

export type MoodEntry = {
  id: string;
  date: string;
  mood: Mood;
  photo?: string;
  notes?: string;
  activities: string[];
};

export type WasteType = 'poop' | 'pee';

export type PoopConsistency = 'normal' | 'soft' | 'wet' | 'dry' | 'diarrhea';
export type PoopColor = 'brown' | 'dark_brown' | 'green' | 'white' | 'red' | 'black';
export type PeeColor = 'clear' | 'cloudy' | 'dark_yellow' | 'orange' | 'red' | 'brown';

export interface WasteLog {
  id: string;
  petId: string;
  date: string;
  type: WasteType;
  frequency: number; // Number of droppings/urinations in this log
  frequencyType: 'per_hour' | 'per_day'; // Type of frequency measurement
  location: string;
  notes?: string;
  // Poop specific
  poopConsistency?: PoopConsistency;
  poopColor?: PoopColor;
  // Pee specific
  peeColor?: PeeColor;
  peeVolume?: 'normal' | 'excessive' | 'reduced';
}

export type GuineaPig = {
  id: string;
  name: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  image?: string;
  gender: 'male' | 'female' | 'unknown';
  createdAt: string;
  updatedAt: string;
  // Family relationships
  motherId?: string;
  fatherId?: string;
  siblings?: string[];
  children?: string[];
  mate?: string;
  // Pregnancy tracking
  isPregnant?: boolean;
  pregnancyStartDate?: string;
  expectedDueDate?: string;
  pregnancyNotes?: string;
  // Health tracking
  healthRecords?: HealthRecord[];
  medications?: Medication[];
  vetAppointments?: VetAppointment[];
  weightHistory?: WeightRecord[];
  moodHistory?: MoodEntry[];
  wasteLogs?: WasteLog[];
  // Care schedule
  careSchedule?: CareSchedule;
  // Diet
  dietPreferences?: DietPreferences;
  feedingSchedule?: FeedingSchedule;
};

export type HealthRecord = {
  id: string;
  date: string;
  type: 'symptom' | 'checkup' | 'treatment' | 'note';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  resolved?: boolean;
  createdAt: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  reminderEnabled: boolean;
  active: boolean;
};

export type VetAppointment = {
  id: string;
  date: string;
  time: string;
  purpose: string;
  vetName?: string;
  clinic?: string;
  notes?: string;
  completed: boolean;
  reminderEnabled: boolean;
};

export type WeightRecord = {
  id: string;
  date: string;
  weight: number; // in grams
  notes?: string;
};

export type CareSchedule = {
  cageCleaningDays: number[];
  lastCageCleaning?: string;
  nailTrimmingInterval: number;
  lastNailTrimming?: string;
  floorTimeSchedule: {
    days: number[];
    duration: number;
  };
  outdoorsTimeSchedule: {
    days: number[];
    duration: number;
  };
  vitaminCSchedule: {
    frequency: 'daily' | 'weekly';
    time: string;
    amount: string;
  };
};

export type DietPreferences = {
  favoriteVegetables: string[];
  favoriteFruits: string[];
  allergies: string[];
  restrictions: string[];
  hayPreference: string;
};

export type FeedingSchedule = {
  hay: {
    frequency: 'daily' | 'twice_daily';
    times: string[];
    amount: string;
  };
  pellets: {
    frequency: 'daily' | 'twice_daily';
    times: string[];
    amount: string;
  };
  vegetables: {
    frequency: 'daily' | 'twice_daily';
    times: string[];
    items: Array<{
      name: string;
      amount: string;
    }>;
  };
  fruits: {
    frequency: 'weekly';
    days: number[];
    amount: string;
  };
};

export interface GuineaGramPost {
  id: string;
  petId: string;
  imageUri: string;
  caption: string;
  date: string;
  likes: number;
  comments?: {
    id: string;
    text: string;
    date: string;
  }[];
}

export interface ForumPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUri?: string;
  date: string;
  likes: number;
  comments: ForumComment[];
  tags: string[];
}

export type ForumComment = {
  id: string;
  userId: string;
  content: string;
  date: string;
  likes: number;
};

export interface BondingSession {
  id: string;
  date: string;
  duration: number; // in minutes
  pets: string[]; // array of pet IDs
  location: string;
  notes?: string;
  success: 'good' | 'neutral' | 'challenging';
  behaviors: string[]; // observed behaviors
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Settings: undefined;
  // Auth screens
  Welcome: undefined;
  PetList: undefined;
  Profile: { 
    pet: GuineaPig;
    onSave?: () => void;
    onDelete?: () => void;
  };
  AddEditPet: { 
    mode?: 'add' | 'edit';
    pet?: GuineaPig;
    onComplete?: () => void;
  };
  BreedSelection: { onSelect: (breed: string) => void };
  Checklist: { petId?: string };
  GuineaGram: { refresh?: number };
  CareGuide: undefined;
  CareGuideSection: { sectionId: string };
  SafeFoods: undefined;
  NewOwnerChecklist: undefined;
  MedicalRecords: { petId: string };
  WeightTracker: { petId: string };
  MoodTracker: { petId: string };
  CareSchedule: { petId: string };
  DietManager: { petId: string };
  Achievements: undefined;
  BondingTracker: { petId?: string };
  BondingTimer: { sessionId?: string; pets?: string[] };
  BondingGuide: undefined;
  SymptomChecker: undefined;
  FamilyTree: { 
    pet: GuineaPig;
    onUpdate?: () => void;
  };
  WasteLog: { petId: string };
  AddWasteLog: { petId: string; onSave: () => void };
};

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};