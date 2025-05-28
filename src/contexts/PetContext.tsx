import { GuineaPig } from '@/navigation/types';
import { loadPets as loadPetsFromStorage, savePets as savePetsToStorage } from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface PetContextType {
  pets: GuineaPig[];
  isLoading: boolean;
  error: string | null;
  setPets: (pets: GuineaPig[]) => void;
  addPet: (pet: GuineaPig) => Promise<void>;
  updatePet: (updatedPet: GuineaPig) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  refreshPets: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

interface PetProviderProps {
  children: ReactNode;
}

export const PetProvider: React.FC<PetProviderProps> = ({ children }) => {
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPetsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedPets = await loadPetsFromStorage();
      setPets(storedPets);
    } catch (error) {
      console.error('Error loading pets:', error);
      setError('Failed to load pets. Please try again.');
      Alert.alert('Error', 'Failed to load pets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPetsData();
  }, []);

  const addPet = async (pet: GuineaPig) => {
    try {
      const newPets = [...pets, pet];
      await savePetsToStorage(newPets);
      setPets(newPets);
    } catch (error) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', 'Failed to add pet. Please try again.');
      throw error;
    }
  };

  const updatePet = async (updatedPet: GuineaPig) => {
    try {
      const newPets = pets.map(pet => 
        pet.id === updatedPet.id ? updatedPet : pet
      );
      await savePetsToStorage(newPets);
      setPets(newPets);
    } catch (error) {
      console.error('Error updating pet:', error);
      Alert.alert('Error', 'Failed to update pet. Please try again.');
      throw error;
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const newPets = pets.filter(pet => pet.id !== petId);
      await savePetsToStorage(newPets);
      setPets(newPets);
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert('Error', 'Failed to delete pet. Please try again.');
      throw error;
    }
  };

  const refreshPets = async () => {
    await loadPetsData();
  };

  return (
    <PetContext.Provider 
      value={{ 
        pets, 
        isLoading,
        error,
        setPets, 
        addPet, 
        updatePet, 
        deletePet,
        refreshPets
      }}
    >
      {children}
    </PetContext.Provider>
  );
}; 