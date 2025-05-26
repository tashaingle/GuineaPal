import PetFeatureMenu from '@/components/PetFeatureMenu';
import { RootStackParamList } from '@/navigation/types';
import { calculateAge, formatAge } from '@/utils/dateUtils';
import { loadPets, savePets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = React.memo(({ route, navigation }: Props) => {
  const { pet: initialPet } = route.params;
  const petIdRef = useRef(initialPet.id);
  const prevPetRef = useRef(initialPet);
  const [pet, setPet] = useState(initialPet);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Load fresh pet data when needed
  const refreshPetData = useCallback(async () => {
    try {
      const pets = await loadPets();
      const freshPet = pets.find(p => p.id === petIdRef.current);
      if (freshPet && JSON.stringify(freshPet) !== JSON.stringify(prevPetRef.current)) {
        prevPetRef.current = freshPet;
        setPet(freshPet);
      }
    } catch (error) {
      console.error('Failed to refresh pet data:', error);
    }
  }, []);

  // Refresh pet data when the screen comes into focus
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = navigation.addListener('focus', () => {
      if (isMounted) {
        refreshPetData();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation, refreshPetData]);

  const handleDelete = useCallback(async () => {
    if (!petIdRef.current) {
      Alert.alert('Error', 'Cannot delete pet: ID not found');
      return;
    }

    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}? This action cannot be undone.`,
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
              const currentPets = await loadPets();
              const updatedPets = currentPets.filter(p => p.id !== petIdRef.current);
              await savePets(updatedPets);
              if (route.params?.onDelete) {
                route.params.onDelete(petIdRef.current);
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
  }, [navigation, pet.name, route.params]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.header}>{pet.name}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              navigation.navigate('AddEditPet', {
                mode: 'edit',
                pet: pet,
                onComplete: refreshPetData
              });
            }}
          >
            <MaterialIcons name="edit" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={pet.image ? { uri: pet.image } : require('../../assets/images/default-pet.png')}
            style={styles.profileImage}
            contentFit="cover"
          />
          
          <View style={styles.infoContainer}>
            {pet.breed && (
              <View style={styles.infoRow}>
                <MaterialIcons name="pets" size={20} color="#5D4037" />
                <Text style={styles.infoText}>{pet.breed}</Text>
              </View>
            )}
            
            {pet.birthDate && (
              <View style={styles.infoRow}>
                <MaterialIcons name="cake" size={20} color="#5D4037" />
                <Text style={styles.infoText}>
                  {formatAge(calculateAge(pet.birthDate))}
                </Text>
              </View>
            )}

            {pet.gender && (
              <View style={styles.infoRow}>
                <MaterialIcons 
                  name={pet.gender === 'male' ? 'person' : pet.gender === 'female' ? 'person-outline' : 'help'} 
                  size={20} 
                  color="#5D4037" 
                />
                <Text style={styles.infoText}>
                  {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                  {pet.gender === 'female' && pet.isPregnant ? ' (Pregnant)' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Care & Health</Text>
          <PetFeatureMenu pet={pet} />
        </View>
      </ScrollView>
    </View>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5D4037',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 16,
  },
});

export default ProfileScreen;