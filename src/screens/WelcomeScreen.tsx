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
    style={[styles.navigationButton, { 
      backgroundColor: colors.background.card,
      borderColor: color + '25',
    }, style]}
    onPress={onPress}
  >
    <View style={styles.navigationButtonContent}>
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={[styles.navigationButtonText, { color }]}>{title}</Text>
    </View>
  </TouchableOpacity>
));

NavigationButton.displayName = 'NavigationButton';

const WelcomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuth();
  const { width, height } = useWindowDimensions();

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

        <View style={styles.navigationGrid}>
          <View style={styles.row}>
            <NavigationButton
              title="Guinea Pigs"
              icon="pets"
              color={colors.primary.DEFAULT}
              onPress={() => navigation.navigate('PetList')}
              style={styles.mainButton}
            />
            <NavigationButton
              title="Symptom Checker"
              icon="medical-services"
              color={colors.secondary.DEFAULT}
              onPress={() => navigation.navigate('SymptomChecker')}
              style={styles.mainButton}
            />
          </View>

          <View style={styles.row}>
            <NavigationButton
              title="Care Checklist"
              icon="list"
              color={colors.primary.DEFAULT}
              onPress={() => navigation.navigate('Checklist', { petId: undefined })}
              style={styles.mainButton}
            />
            <NavigationButton
              title="GuineaGram"
              icon="photo-library"
              color={colors.secondary.DEFAULT}
              onPress={() => navigation.navigate('GuineaGram', { refresh: Date.now() })}
              style={styles.mainButton}
            />
          </View>

          <View style={styles.row}>
            <NavigationButton
              title="Bonding Timer"
              icon="timer"
              color={colors.primary.DEFAULT}
              onPress={() => navigation.navigate('BondingTracker')}
              style={styles.mainButton}
            />
            <NavigationButton
              title="Care Guide"
              icon="menu-book"
              color={colors.primary.DEFAULT}
              onPress={() => navigation.navigate('CareGuide')}
              style={styles.mainButton}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color={colors.text.secondary} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 24
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center'
  },
  navigationGrid: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 24
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    height: '30%'
  },
  mainButton: {
    flex: 1,
    height: '100%',
    borderRadius: 12
  },
  navigationButton: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navigationButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
    height: '100%'
  },
  navigationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500'
  }
});

export default WelcomeScreen; 