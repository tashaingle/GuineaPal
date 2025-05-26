import type { GuineaPig } from '@/navigation/types';
import { Stats } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PETS_KEY = '@guineapals_pets';
const LAST_SYNC_KEY = '@guineapals_last_sync';
const BACKUP_KEY = `${PETS_KEY}_backup`;
const STATS_KEY = '@guinea_pal_stats';

type StorageOperationResult<T> = {
  success: boolean;
  data?: T;
  error?: Error;
};


const isValidPet = (pet: unknown): pet is GuineaPig => {
  return (
    typeof pet === 'object' && 
    pet !== null &&
    'id' in pet && 
    typeof pet.id === 'string' &&
    'name' in pet && 
    typeof pet.name === 'string'
  );
};

export const loadPets = async (): Promise<GuineaPig[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PETS_KEY);
    if (!jsonValue) return [];

    const parsed = JSON.parse(jsonValue);
    
    if (!Array.isArray(parsed)) {
      console.warn('Stored pets data is not an array - migrating to array format');
      
      if (isValidPet(parsed)) {
        return [parsed];
      }
      return [];
    }

    
    const validPets = parsed.filter((pet): pet is GuineaPig => isValidPet(pet));
    if (validPets.length !== parsed.length) {
      console.warn(`Filtered out ${parsed.length - validPets.length} invalid pets`);
      
      await AsyncStorage.setItem(PETS_KEY, JSON.stringify(validPets));
    }

    return validPets;

  } catch (error) {
    console.error('Failed to load pets:', error);
   
    try {
      const backup = await AsyncStorage.getItem(BACKUP_KEY);
      if (backup) {
        const backupData = JSON.parse(backup);
        if (Array.isArray(backupData)) {
          await AsyncStorage.setItem(PETS_KEY, backup);
          return backupData.filter((pet): pet is GuineaPig => isValidPet(pet));
        }
      }
    } catch (backupError) {
      console.error('Backup restoration failed:', backupError);
    }
    
    return []; 
  }
};

export const savePets = async (pets: GuineaPig[]): Promise<StorageOperationResult<void>> => {
  if (!Array.isArray(pets)) {
    return {
      success: false,
      error: new Error('Pets data must be an array')
    };
  }

  try {
    
    const currentPets = await loadPets();
    await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(currentPets));

  
    const validPets = pets.filter(pet => isValidPet(pet));
    if (validPets.length !== pets.length) {
      console.warn(`Not saving ${pets.length - validPets.length} invalid pets`);
    }

    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(validPets));
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save pets:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Failed to save pets')
    };
  }
};

export const getPetById = async (id: string): Promise<StorageOperationResult<GuineaPig | undefined>> => {
  if (!id || typeof id !== 'string') {
    return {
      success: false,
      error: new Error('Invalid pet ID')
    };
  }

  try {
    const pets = await loadPets();
    const pet = pets.find(pet => pet.id === id);
    return { 
      success: true, 
      data: pet 
    };
  } catch (error) {
    console.error(`Failed to get pet with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Pet lookup failed')
    };
  }
};

export const addOrUpdatePet = async (pet: GuineaPig): Promise<StorageOperationResult<void>> => {
  if (!isValidPet(pet)) {
    return {
      success: false,
      error: new Error('Invalid pet data')
    };
  }

  try {
    const pets = await loadPets();
    const existingIndex = pets.findIndex(p => p.id === pet.id);
   
    const newPets = [...pets]; 
    if (existingIndex >= 0) {
      newPets[existingIndex] = pet;
    } else {
      newPets.push(pet);
    }

    return await savePets(newPets);
  } catch (error) {
    console.error('Failed to update pets:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Update operation failed')
    };
  }
};

export const deletePet = async (id: string): Promise<StorageOperationResult<boolean>> => {
  if (!id || typeof id !== 'string') {
    return {
      success: false,
      error: new Error('Invalid pet ID')
    };
  }

  try {
    const pets = await loadPets();
    const newPets = pets.filter(pet => pet.id !== id);
   
    if (newPets.length !== pets.length) {
      await savePets(newPets);
      return { success: true, data: true };
    }
    return { success: true, data: false };
  } catch (error) {
    console.error(`Failed to delete pet with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Deletion failed')
    };
  }
};

export const loadStats = async (): Promise<Stats> => {
    try {
        const savedStats = await AsyncStorage.getItem(STATS_KEY);
        if (savedStats) {
            return JSON.parse(savedStats);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
    
    // Return default stats if none found
    return {
        happiness: 50,
        hunger: 50,
        health: 50,
        energy: 50,
        interactionCount: 0,
        lastInteraction: new Date().toISOString(),
        dailyInteractions: {
            [new Date().toDateString()]: 0
        }
    };
};

export const saveStats = async (stats: Stats): Promise<void> => {
    try {
        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error('Error saving stats:', error);
    }
};
