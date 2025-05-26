import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const NavigationButton = React.memo(({ title, icon, color, onPress, style }: {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  onPress: () => void;
  style?: any;
}) => (
  <TouchableOpacity
    style={[styles.navigationButton, { backgroundColor: color + '10' }, style]}
    onPress={onPress}
  >
    <View style={styles.navigationButtonContent}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={32} color={color} />
      </View>
      <Text style={[styles.navigationButtonText, { color }]}>{title}</Text>
    </View>
  </TouchableOpacity>
));

NavigationButton.displayName = 'NavigationButton';

const WelcomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const buttonSize = width > 500 ? '30%' : '45%';

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Auth context will handle navigation
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.welcomeText}>Welcome to GuineaPal</Text>
        </View>

        {/* Prominent Guinea Pigs Button */}
        <View style={styles.symptomCheckerContainer}>
          <NavigationButton
            title="Guinea Pigs"
            icon="pets"
            color="#795548"
            onPress={() => navigation.navigate('PetList')}
            style={styles.symptomCheckerButton}
          />
          <Text style={styles.symptomCheckerDescription}>
            Manage and monitor your guinea pig companions
          </Text>
        </View>

        <View style={styles.navigationContainer}>
          <NavigationButton
            title="Symptom Checker"
            icon="medical-services"
            color={colors.buttons.red}
            onPress={() => navigation.navigate('SymptomChecker')}
          />
          <NavigationButton
            title="Care Checklist"
            icon="list"
            color="#4CAF50"
            onPress={() => navigation.navigate('Checklist', { petId: undefined })}
          />
          <NavigationButton
            title="GuineaGram"
            icon="photo-library"
            color="#2196F3"
            onPress={() => navigation.navigate('GuineaGram', { refresh: Date.now() })}
          />
          <NavigationButton
            title="News of the Wheek"
            icon="forum"
            color="#FF9800"
            onPress={() => navigation.navigate('NewsOfTheWheek')}
          />
          <NavigationButton
            title="Bonding Timer"
            icon="timer"
            color="#E91E63"
            onPress={() => navigation.navigate('BondingTracker')}
          />
          <NavigationButton
            title="Care Guide"
            icon="menu-book"
            color="#9C27B0"
            onPress={() => navigation.navigate('CareGuide')}
          />
        </View>

        {/* New bottom logout button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#D32F2F" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center',
  },
  symptomCheckerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: colors.buttons.red + '05',
  },
  symptomCheckerButton: {
    width: '100%',
    aspectRatio: undefined,
    height: 80,
    marginBottom: 12,
  },
  symptomCheckerDescription: {
    fontSize: 14,
    color: colors.buttons.red + '99',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  navigationButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 12,
  },
  navigationButtonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  navigationButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFE0E0',
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
});

export default WelcomeScreen; 