import { RootStackParamList } from '@/navigation/types';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HealthRecord {
  id: string;
  date: string;
  type: 'weight' | 'symptom' | 'vet';
  value: string;
  notes: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'WeightTracker'>;

const HealthTrackerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pet } = route.params;
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'weight' | 'symptom' | 'vet'>('weight');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const insets = useSafeAreaInsets();

  // Load records when component mounts
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const saved = await AsyncStorage.getItem(`@guineapal_health_records_${pet.id}`);
        if (saved) setRecords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load records', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, [pet.id]);

  // Save records whenever they change
  useEffect(() => {
    AsyncStorage.setItem(`@guineapal_health_records_${pet.id}`, JSON.stringify(records));
  }, [records, pet.id]);

  const addRecord = () => {
    if (!value) return;
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      type: activeTab,
      value: value,
      notes: notes,
    };
    setRecords([newRecord, ...records]);
    setValue('');
    setNotes('');
  };

  const renderItem = ({ item }: { item: HealthRecord }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.recordHeader}>
          <MaterialCommunityIcons
            name={
              item.type === 'weight' ? 'scale' :
              item.type === 'symptom' ? 'alert-circle' : 'medical-bag'
            }
            size={24}
            color="#5D4037"
          />
          <Text style={styles.recordDate}>{item.date}</Text>
        </View>
        <Text style={styles.recordValue}>{item.value}</Text>
        {item.notes ? <Text style={styles.recordNotes}>Notes: {item.notes}</Text> : null}
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large' as ActivityIndicatorProps['size']} color="#5D4037" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              console.log('Retry button pressed');
              // Implement retry logic here
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('Back button pressed');
            navigation.goBack();
          }}
          testID="back-button"
        >
          <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.header}>Health Tracker</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weight' && styles.activeTab]}
          onPress={() => setActiveTab('weight')}
        >
          <MaterialCommunityIcons name="scale" size={24} color="#5D4037" />
          <Text>Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'symptom' && styles.activeTab]}
          onPress={() => setActiveTab('symptom')}
        >
          <MaterialCommunityIcons name="alert-circle" size={24} color="#5D4037" />
          <Text>Symptoms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vet' && styles.activeTab]}
          onPress={() => setActiveTab('vet')}
        >
          <MaterialCommunityIcons name="medical-bag" size={24} color="#5D4037" />
          <Text>Vet Visits</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          label={activeTab === 'weight' ? 'Weight (g)' : activeTab === 'symptom' ? 'Symptom' : 'Vet Visit Details'}
          value={value}
          onChangeText={setValue}
          style={styles.input}
          keyboardType={activeTab === 'weight' ? 'numeric' : 'default'}
        />
        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          multiline
        />
        <Button
          mode="contained"
          onPress={addRecord}
          style={styles.button}
        >
          Add Record
        </Button>
      </View>

      <FlatList
        data={records.filter(record => record.type === activeTab)}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#5D4037',
  },
  form: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#5D4037',
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    marginLeft: 8,
    color: '#757575',
  },
  recordValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  recordNotes: {
    color: '#616161',
    fontStyle: 'italic',
  },
  loadingContainer: {
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
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#5D4037',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HealthTrackerScreen;