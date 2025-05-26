import { RootStackParamList } from '@/navigation/types';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'BreedSelection'>;

const GUINEA_PIG_BREEDS = [
  'Unknown',
  'American',
  'Abyssinian',
  'Alpaca',
  'Baldwin',
  'Coronet',
  'Merino',
  'Peruvian',
  'Rex',
  'Satin',
  'Silkie',
  'Skinny',
  'Teddy',
  'Texel',
  'White Crested'
];

const BreedSelectionScreen = ({ navigation, route }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState(GUINEA_PIG_BREEDS);
  const insets = useSafeAreaInsets();

  const filterBreeds = useCallback((query: string) => {
    const normalizedQuery = query.toLowerCase();
    return GUINEA_PIG_BREEDS.filter(breed =>
      breed.toLowerCase().includes(normalizedQuery)
    );
  }, []);

  useEffect(() => {
    setFilteredBreeds(filterBreeds(searchQuery));
  }, [searchQuery, filterBreeds]);

  const handleBreedSelect = (breed: string) => {
    if (route.params?.onSelectBreed) {
      route.params.onSelectBreed(breed);
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.header}>Select Breed</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search breeds..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9E9E9E"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <MaterialIcons name="clear" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredBreeds}
          keyExtractor={item => item}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.breedItem}
              onPress={() => handleBreedSelect(item)}
            >
              <Text style={styles.breedText}>{item}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#5D4037" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>No breeds found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  header: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center'
  },
  content: {
    flex: 1,
    padding: 16
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#212121'
  },
  clearButton: {
    padding: 8
  },
  breedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  breedText: {
    flex: 1,
    fontSize: 16,
    color: '#212121'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#5D4037',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#795548',
    textAlign: 'center'
  }
});

export default BreedSelectionScreen;