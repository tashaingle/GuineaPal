import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { addOrUpdatePet } from '@utils/storage';


type GuineaPig = {
  id: string;
  name: string;
  breed: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditPet'>;

const AddEditPetScreen = ({ route, navigation }: Props) => {
  const { pet, mode = 'add', onComplete } = route.params || {};
  const [formData, setFormData] = useState<Partial<GuineaPig>>({
    name: pet?.name || '',
    breed: pet?.breed || '',
    image: pet?.image || null,
    id: pet?.id || Date.now().toString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

 
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleChange = useCallback((field: keyof GuineaPig, value: string | null) => {
    setFormData((prev: Partial<GuineaPig>) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!formData.name?.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    setIsSubmitting(true);
    try {
      const completePet: GuineaPig = {
        ...formData,
        name: formData.name!.trim(),
        breed: formData.breed || 'Unknown',
        image: formData.image || null,
        id: formData.id!,
        createdAt: pet?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addOrUpdatePet(completePet);
      
      if (onComplete) {
        onComplete(completePet);
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save pet');
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    setIsLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to select an image');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        handleChange('image', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
      console.error('Image picker error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToBreedSelection = () => {
    navigation.navigate('BreedSelection', {
      petId: formData.id || Date.now().toString(), 
      currentBreed: formData.breed,
      onSelectBreed: (selectedBreed: string) => handleChange('breed', selectedBreed)
    });
  };

  return (
    <View style={styles.container}>
      {!keyboardVisible && (
        <TouchableOpacity 
          onPress={pickImage} 
          disabled={isLoading}
          style={styles.imagePicker}
          testID="image-picker-button"
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#5D4037" />
          ) : (
            <>
              <Image 
                source={formData.image || require('@assets/images/default-pet.png')} 
                style={styles.petImage}
                contentFit="cover"
                transition={200}
                testID="pet-image"
                accessibilityLabel={formData.name ? `${formData.name}'s image` : 'Pet image'}
              />
              <View style={styles.cameraIcon}>
                <MaterialIcons 
                  name={formData.image ? 'edit' : 'add-a-photo'} 
                  size={24} 
                  color="white" 
                />
              </View>
            </>
          )}
        </TouchableOpacity>
      )}

      <TextInput
        placeholder="Pet Name*"
        placeholderTextColor="#999"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
        maxLength={30}
        testID="name-input"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        accessibilityLabel="Pet name input"
      />

      <TouchableOpacity 
        style={styles.breedButton}
        onPress={navigateToBreedSelection}
        testID="breed-select-button"
        accessibilityLabel="Select breed button"
      >
        <Text style={!formData.breed ? styles.placeholderText : styles.breedText}>
          {formData.breed || 'Select Breed'}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#5D4037" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, (!formData.name?.trim() || isSubmitting) && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!formData.name?.trim() || isSubmitting}
        testID="save-button"
        accessibilityLabel={mode === 'add' ? 'Add pet button' : 'Save changes button'}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveButtonText}>
            {mode === 'add' ? 'Add Pet' : 'Save Changes'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImage: {
    width: '100%',
    height: '100%',
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
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  breedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
    backgroundColor: 'white',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  breedText: {
    color: '#212121',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#5D4037',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditPetScreen;