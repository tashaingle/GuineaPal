import { GuineaPig } from '@/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface PetContextType {
  pets: GuineaPig[];
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

  const loadPets = async () => {
    try {
      const storedPets = await AsyncStorage.getItem('pets');
      if (storedPets) {
        setPets(JSON.parse(storedPets));
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const savePets = async (newPets: GuineaPig[]) => {
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(newPets));
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  };

  const addPet = async (pet: GuineaPig) => {
    const newPets = [...pets, pet];
    setPets(newPets);
    await savePets(newPets);
  };

  const updatePet = async (updatedPet: GuineaPig) => {
    const newPets = pets.map(pet => 
      pet.id === updatedPet.id ? updatedPet : pet
    );
    setPets(newPets);
    await savePets(newPets);
  };

  const deletePet = async (petId: string) => {
    const newPets = pets.filter(pet => pet.id !== petId);
    setPets(newPets);
    await savePets(newPets);
  };

  const refreshPets = async () => {
    await loadPets();
  };

  return (
    <PetContext.Provider 
      value={{ 
        pets, 
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