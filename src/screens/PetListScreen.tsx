import { usePets } from '@/contexts/PetContext';
import { GuineaPig, RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PetListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { pets, isLoading, error, refreshPets } = usePets();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isFocused) {
      refreshPets();
    }
  }, [isFocused]);

  const navigateToProfile = (pet: GuineaPig) => {
    navigation.navigate('Profile', { 
      pet,
      onSave: refreshPets,
      onDelete: refreshPets
    });
  };

  const navigateToAddPet = () => {
    navigation.navigate('AddEditPet', { 
      mode: 'add',
      onComplete: refreshPets
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color={colors.text.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.buttons.red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshPets}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.card,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.brown} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.buttons.brown }]}>My Guinea Pigs</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {pets.map((pet: GuineaPig) => (
            <TouchableOpacity
              key={pet.id}
              style={[styles.petCard, { 
                backgroundColor: colors.background.card,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }]}
              onPress={() => navigateToProfile(pet)}
            >
              <View style={[styles.imageContainer, { backgroundColor: colors.buttons.brown + '20' }]}>
                <Image
                  source={pet.image ? { uri: pet.image } : require('../../assets/images/default-pet.png')}
                  style={styles.petImage}
                  contentFit="cover"
                  placeholder={require('../../assets/images/placeholder.png')}
                  transition={200}
                />
              </View>
              <Text style={[styles.petCardName, { color: colors.buttons.brown }]} numberOfLines={1} ellipsizeMode="tail">
                {pet.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.petCard, { 
              backgroundColor: colors.background.card,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }]}
            onPress={navigateToAddPet}
          >
            <View style={[styles.addPetIcon, { backgroundColor: colors.primary.DEFAULT + '20' }]}>
              <MaterialIcons name="add" size={40} color={colors.primary.DEFAULT} />
            </View>
            <Text style={[styles.petCardName, { color: colors.primary.DEFAULT }]}>
              Add New Pet
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  petCard: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  petCardName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addPetIcon: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.buttons.red,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.text.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#5D4037'
  },
  listContent: {
    paddingBottom: 80
  },
  emptyListContent: {
    flex: 1
  }
});

export default PetListScreen; 