import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  ScrollView 
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation, route }: ProfileScreenProps) => {
  const { pet, mode = 'view' } = route.params;
  const [editablePet, setEditablePet] = useState(pet);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsEditing(mode === 'edit');
  }, [mode]);

  const handleSave = async () => {
    if (!editablePet.name.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid name');
      return;
    }

    setIsLoading(true);
    try {
      const petsData = await AsyncStorage.getItem('@pets');
      const pets = petsData ? JSON.parse(petsData) : {};
      pets[pet.id] = { 
        ...editablePet, 
        updatedAt: new Date().toISOString() 
      };
      await AsyncStorage.setItem('@pets', JSON.stringify(pets));
      
      if (route.params.onSave) {
        route.params.onSave(editablePet);
      }
      
      setIsEditing(false);
      navigation.setParams({ 
        pet: editablePet,
        mode: 'view'
      });
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save pet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreedSelect = () => {
    navigation.navigate('BreedSelection', {
      petId: editablePet.id, 
      currentBreed: editablePet.breed,
      onSelectBreed: (breed: string) => {
        setEditablePet(prev => ({ 
          ...prev, 
          breed,
          updatedAt: new Date().toISOString()
        }));
      }
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No pet data available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.title}>{editablePet.name}'s Profile</Text>
      </View>

      {/* Pet Image */}
      <TouchableOpacity 
        style={styles.imageContainer}
        disabled={!isEditing || isLoading}
      >
        <Image 
          source={imageError || !editablePet.image 
            ? require('@assets/default-pet.png') 
            : { uri: editablePet.image }}
          style={styles.petImage}
          contentFit="cover"
          transition={200}
          onError={handleImageError}
        />
        {isEditing && (
          <View style={styles.cameraIcon}>
            <MaterialIcons name="photo-camera" size={20} color="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Breed Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Breed</Text>
        {isEditing ? (
          <TouchableOpacity
            style={styles.breedButton}
            onPress={handleBreedSelect}
            disabled={isLoading}
          >
            <Text style={styles.breedText}>
              {editablePet.breed || 'Select Breed'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#5D4037" />
          </TouchableOpacity>
        ) : (
          <Text style={styles.value}>{editablePet.breed || 'Not specified'}</Text>
        )}
      </View>

      {/* Editable Fields */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editablePet.name}
            onChangeText={(text) => 
              setEditablePet(prev => ({ ...prev, name: text }))
            }
            maxLength={20}
            placeholder="Pet name"
            editable={!isLoading}
          />
        ) : (
          <Text style={styles.value}>{editablePet.name}</Text>
        )}
      </View>

      {/* Additional Info */}
      <View style={styles.section}>
        <Text style={styles.label}>Birth Date</Text>
        <Text style={styles.value}>
          {editablePet.birthDate 
            ? new Date(editablePet.birthDate).toLocaleDateString() 
            : 'Not specified'}
        </Text>
      </View>

      {/* Action Buttons */}
      {route.params.mode !== 'view' && (
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditablePet(pet);
                  setIsEditing(false);
                  navigation.setParams({ mode: 'view' });
                }}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => {
                setIsEditing(true);
                navigation.setParams({ mode: 'edit' });
              }}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  backButtonText: {
    color: '#5D4037',
    fontSize: 16,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    flex: 1,
    textAlign: 'center',
    marginRight: 24, 
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E0E0E0',
  },
  cameraIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#5D4037',
    borderRadius: 20,
    padding: 8,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 8,
    fontWeight: '600',
  },
  breedButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  breedText: {
    fontSize: 16,
    color: '#212121',
  },
  value: {
    fontSize: 18,
    color: '#212121',
    paddingVertical: 12,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#5D4037',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;