import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown',
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export type HealthTabType = 'weight' | 'medication' | 'appointments' | 'notes';
export type ChecklistCategory = 'feeding' | 'grooming' | 'health' | 'social';
export type ChecklistFrequency = 'daily' | 'weekly' | 'monthly';
export type HealthMetricType = 'weight' | 'temperature' | 'foodIntake' | 'activity';
export type PetEventType = 'feeding' | 'medication' | 'vet' | 'grooming' | 'playtime' | 'training';

export interface GuineaPig {
  id: string;
  name: string;
  breed: string;
  birthDate?: string | null;
  gender?: Gender | null;
  color?: string | null;
  image: string | null; 
  weight?: number | null;
  lastVetVisit?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
}

export type BreedOption = {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  isCustom?: boolean;
  popularity?: number;
};

export type ChecklistItem = {
  id: string;
  title: string;
  category: ChecklistCategory;
  frequency: ChecklistFrequency;
  lastCompleted?: string | null;
  isComplete: boolean;
  reminderEnabled?: boolean;
};

export type HealthRecord = {
  id: string;
  petId: string;
  type: HealthMetricType;
  value: number;
  date: string;
  notes?: string | null;
  recordedBy?: string | null;
};

export type PetEvent = {
  id: string;
  petId: string;
  type: PetEventType;
  date: string;
  duration?: number | null;
  notes?: string | null;
  completed: boolean;
  attachments?: string[] | null;
  location?: string | null;
};

export type RootStackParamList = {
  Home: undefined;
  Profile: {
    pet: GuineaPig;
    mode?: 'view' | 'edit';
    onSave?: (updatedPet: GuineaPig) => void;
    onDelete?: (petId: string) => void;
  };
  BreedSelection: {
    petId: string;
    currentBreed?: string | null;
    onSelectBreed: (breed: string) => void;
    allowCustomBreeds?: boolean;
  };
  Checklist: {
    petId?: string | null;
    date?: string | null;
  };
  HealthTracker: {
    petId: string;
    initialTab?: HealthTabType;
  };
  AddEditPet: {
    pet?: PartialBy<GuineaPig, 'id'>;
    mode: 'add' | 'edit';
    onComplete?: (pet: GuineaPig) => void;
  };
};

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

export type ApiResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  success: boolean;
  timestamp?: string;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
} & {
  general?: string;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];


export type ProfileScreenProps = ScreenProps<'Profile'>;
export type BreedSelectionScreenProps = ScreenProps<'BreedSelection'>;
export type ChecklistScreenProps = ScreenProps<'Checklist'>;
export type HealthTrackerScreenProps = ScreenProps<'HealthTracker'>;
export type AddEditPetScreenProps = ScreenProps<'AddEditPet'>;


export type WithTestID<T = {}> = T & {
  testID?: string;
};