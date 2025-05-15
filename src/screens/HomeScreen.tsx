import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { loadPets } from '@utils/storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import type { GuineaPig } from '@navigation/types';


const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  petName: {
    flex: 1,
    fontSize: 18,
    color: '#212121',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    flex: 1,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#5D4037',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#757575',
    fontWeight: 'bold',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#5D4037',
  },
});

type ScreenContentWrapperProps = {
  children: React.ReactNode;
  noPadding?: boolean;
};

type PetCardProps = {
  pet: GuineaPig;
  onPress: () => void;
};

type ActionButtonProps = {
  title: string; 
  onPress: () => void; 
  color: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  testID?: string;
};

const ScreenContentWrapper = ({ children, noPadding }: ScreenContentWrapperProps) => (
  <View style={[styles.screenWrapper, noPadding && styles.noPadding]}>
    {children}
  </View>
);

const PetCard = React.memo(({ pet, onPress }: PetCardProps) => (
  <TouchableOpacity 
    style={styles.petCard} 
    onPress={onPress}
    activeOpacity={0.7}
    testID={`pet-card-${pet.id}`}
  >
    <Image 
      source={pet.image || require('@assets/default-pet.png')}
      style={styles.petImage}
      contentFit="cover"
      placeholder={require('@assets/placeholder.png')} 
      transition={200}
      accessibilityLabel={pet.name ? `${pet.name}'s image` : 'Pet image'}
    />
    <Text style={styles.petName} numberOfLines={1} ellipsizeMode="tail">
      {pet.name}
    </Text>
    <MaterialIcons name="chevron-right" size={24} color="#5D4037" />
  </TouchableOpacity>
));

const ActionButton = React.memo(({ 
  title, 
  onPress, 
  color,
  icon,
  testID
}: ActionButtonProps) => (
  <TouchableOpacity 
    style={[styles.actionButton, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    testID={testID}
  >
    <MaterialIcons name={icon} size={20} color="white" />
    <Text style={styles.actionButtonText}>{title}</Text>
  </TouchableOpacity>
));

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const savedPets = await loadPets();
      setPets(savedPets || []);
    } catch (err) {
      console.error('Failed to load pets:', err);
      setError('Failed to load pets. Please try again.');
      Alert.alert('Error', 'Failed to load pets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadPetData();
    }
  }, [isFocused, loadPetData]);

  const navigateToProfile = useCallback((pet: GuineaPig) => {
    navigation.navigate('Profile', { pet });
  }, [navigation]);

  const navigateToAddPet = useCallback(() => {
    navigation.navigate('AddEditPet', { mode: 'add' });
  }, [navigation]);

  const navigateToChecklist = useCallback(() => {
    navigation.navigate('Checklist', {});
  }, [navigation]);

  const navigateToHealthTracker = useCallback(() => {
    navigation.navigate('HealthTracker', { petId: pets[0]?.id || '' });
  }, [navigation, pets]);

  return (
    <ScreenContentWrapper noPadding>
      {isLoading ? (
        <ActivityIndicator 
          size="large" 
          color="#5D4037" 
          style={styles.loadingIndicator} 
          testID="loading-indicator"
        />
      ) : error ? (
        <View style={styles.errorContainer} testID="error-container">
          <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadPetData}
            testID="retry-button"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>GuineaPals</Text>
          </View>

          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={pets.length === 0 ? styles.emptyListContent : styles.listContent}
            renderItem={({ item }) => (
              <PetCard 
                pet={item} 
                onPress={() => navigateToProfile(item)}
              />
            )}
            ListHeaderComponent={
              pets.length > 0 ? (
                <Text style={styles.sectionTitle}>Your Pets</Text>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer} testID="empty-state">
                <MaterialIcons name="pets" size={48} color="#BDBDBD" />
                <Text style={styles.emptyText}>No pets added yet</Text>
                <Text style={styles.emptySubtext}>Tap the + button to add your first pet</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            testID="pets-list"
          />

          <View style={styles.actionContainer}>
            <ActionButton
              title="Daily Care"
              onPress={navigateToChecklist}
              color="#4CAF50"
              icon="checklist"
              testID="checklist-button"
            />
            <ActionButton
              title="Health Tracker"
              onPress={navigateToHealthTracker}
              color="#7B1FA2"
              icon="monitor-heart"
              testID="health-tracker-button"
            />
          </View>

          <FAB
            icon="plus"
            style={styles.fab}
            color="white"
            onPress={navigateToAddPet}
            testID="add-pet-fab"
            accessibilityLabel="Add new pet"
          />
        </>
      )}
    </ScreenContentWrapper>
  );
};

export default React.memo(HomeScreen);