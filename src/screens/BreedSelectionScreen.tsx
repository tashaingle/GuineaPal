import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BreedSelection'>;

const BREEDS = [
  'Abyssinian',
  'American',
  'Coronet',
  'Peruvian',
  'Silkie',
  'Teddy',
  'Texel',
  'White Crested',
  'Skinny Pig',
  'Baldwin',
  'Lunkarya',
  'Alpaca',
  'Merino',
  'Sheba Mini Yak'
];

const BreedSelectionScreen = ({ navigation, route }: Props) => {
  const { petId, currentBreed, onSelectBreed } = route.params;
  const [selectedBreed, setSelectedBreed] = useState(currentBreed || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentBreed) {
      setSelectedBreed(currentBreed);
    }
  }, [currentBreed]);

  const handleConfirm = useCallback(() => {
    if (onSelectBreed && selectedBreed) {
      onSelectBreed(selectedBreed);
    }
    navigation.goBack();
  }, [selectedBreed, onSelectBreed, navigation]);

  const filteredBreeds = BREEDS.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBreedItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.breedItem,
        selectedBreed === item && styles.selectedBreedItem
      ]}
      onPress={() => setSelectedBreed(item)}
      accessibilityLabel={`Select ${item} breed`}
      accessibilityRole="button"
    >
      <Text style={[
        styles.breedText,
        selectedBreed === item && styles.selectedBreedText
      ]}>
        {item}
      </Text>
      {selectedBreed === item && (
        <MaterialIcons name="check" size={24} color="#FFF8E1" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Select Breed</Text>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
            accessibilityLabel="Close breed selection"
          >
            <MaterialIcons name="close" size={24} color="#5D4037" />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search breeds..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        <FlatList
          data={filteredBreeds}
          renderItem={renderBreedItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No breeds found</Text>
          }
        />

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedBreed && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedBreed}
          accessibilityLabel={selectedBreed ? `Confirm ${selectedBreed}` : 'Select a breed first'}
        >
          <Text style={styles.confirmText}>
            {selectedBreed ? `Confirm ${selectedBreed}` : 'Select Breed'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  closeButton: {
    padding: 8,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listContent: {
    paddingBottom: 20,
  },
  breedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  selectedBreedItem: {
    backgroundColor: '#5D4037',
    borderColor: '#4E342E',
  },
  breedText: {
    fontSize: 16,
    color: '#212121',
  },
  selectedBreedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 20,
    fontSize: 16,
  },
  confirmButton: {
    padding: 16,
    backgroundColor: '#5D4037',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BreedSelectionScreen;