import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GuineaPig } from '../types';

const PETS_KEY = '@guineapals_pets';
const LAST_SYNC_KEY = '@guineapals_last_sync';
const BACKUP_KEY = `${PETS_KEY}_backup`;


type StorageOperationResult<T> = {
  success: boolean;
  data?: T;
  error?: Error;
};

export const loadPets = async (): Promise<GuineaPig[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PETS_KEY);
    if (!jsonValue) return [];

    const parsed = JSON.parse(jsonValue) as unknown;
    
    if (!Array.isArray(parsed)) {
      console.warn('Stored pets data is not an array');
      return [];
    }

    
    if (parsed.length > 0 && !('id' in parsed[0])) {
      throw new Error('Invalid pet data structure');
    }

    return parsed as GuineaPig[];

  } catch (error) {
    console.error('Failed to load pets:', error);
    throw new Error('Failed to load pets. Please try again.');
  }
};

export const savePets = async (pets: GuineaPig[]): Promise<StorageOperationResult<void>> => {
  try {
    // Create backup first
    const currentPets = await loadPets().catch(() => []);
    await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(currentPets));

    // Save new data
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
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
  try {
    const pets = await loadPets();
    const pet = pets.find(pet => pet.id === id);
    return { success: true, data: pet };
  } catch (error) {
    console.error(`Failed to get pet with ID ${id}:`, error);
    return { 
      success: false,
      error: error instanceof Error ? error : new Error('Pet lookup failed')
    };
  }
};

export const addOrUpdatePet = async (pet: GuineaPig): Promise<StorageOperationResult<void>> => {
  try {
    const pets = await loadPets();
    const existingIndex = pets.findIndex(p => p.id === pet.id);
    
    if (existingIndex >= 0) {
      pets[existingIndex] = pet;
    } else {
      pets.push(pet);
    }

    await savePets(pets);
    return { success: true };
  } catch (error) {
    console.error('Failed to update pets:', error);
    return { 
      success: false,
      error: error instanceof Error ? error : new Error('Update operation failed')
    };
  }
};

export const deletePet = async (id: string): Promise<StorageOperationResult<boolean>> => {
  try {
    const pets = await loadPets();
    const initialLength = pets.length;
    const newPets = pets.filter(pet => pet.id !== id);
    
    if (newPets.length !== initialLength) {
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

export const restoreFromBackup = async (): Promise<StorageOperationResult<boolean>> => {
  try {
    const backup = await AsyncStorage.getItem(BACKUP_KEY);
    if (backup) {
      await AsyncStorage.setItem(PETS_KEY, backup);
      return { success: true, data: true };
    }
    return { success: true, data: false };
  } catch (error) {
    console.error('Restore failed:', error);
    return { 
      success: false,
      error: error instanceof Error ? error : new Error('Restore operation failed')
    };
  }
};

export const getLastSyncTime = async (): Promise<StorageOperationResult<Date | null>> => {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return { 
      success: true, 
      data: timestamp ? new Date(timestamp) : null 
    };
  } catch (error) {
    console.error('Failed to get last sync time:', error);
    return { 
      success: false,
      error: error instanceof Error ? error : new Error('Failed to retrieve sync time')
    };
  }
};

export const migratePetData = async (): Promise<StorageOperationResult<void>> => {
  try {
    const oldData = await AsyncStorage.getItem('@pets'); 
    if (oldData) {
      await AsyncStorage.setItem(PETS_KEY, oldData);
      await AsyncStorage.removeItem('@pets');
    }
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { 
      success: false,
      error: error instanceof Error ? error : new Error('Migration failed')
    };
  }
};