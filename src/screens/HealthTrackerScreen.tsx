import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Checkbox, TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HealthRecord {
  id: string;
  date: string;
  type: 'weight' | 'symptom' | 'vet';
  value: string;
  notes: string;
}

const HealthTrackerScreen = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [weight, setWeight] = useState('');
  const [symptom, setSymptom] = useState('');
  const [vetNotes, setVetNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'weight' | 'symptoms' | 'vet'>('weight');

  
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const saved = await AsyncStorage.getItem('@guineapal_health_records');
        if (saved) setRecords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load records', e);
      }
    };
    loadRecords();
  }, []);

  
  useEffect(() => {
    AsyncStorage.setItem('@guineapal_health_records', JSON.stringify(records));
  }, [records]);

  const addWeightRecord = () => {
    if (!weight) return;
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      type: 'weight',
      value: `${weight} grams`,
      notes: '',
    };
    setRecords([newRecord, ...records]);
    setWeight('');
  };

  const addSymptomRecord = () => {
    if (!symptom) return;
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      type: 'symptom',
      value: symptom,
      notes: '',
    };
    setRecords([newRecord, ...records]);
    setSymptom('');
  };

  const addVetRecord = () => {
    if (!vetNotes) return;
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      type: 'vet',
      value: 'Vet Visit',
      notes: vetNotes,
    };
    setRecords([newRecord, ...records]);
    setVetNotes('');
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

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'weight' && styles.activeTab]}
          onPress={() => setActiveTab('weight')}
        >
          <Text>Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'symptoms' && styles.activeTab]}
          onPress={() => setActiveTab('symptoms')}
        >
          <Text>Symptoms</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'vet' && styles.activeTab]}
          onPress={() => setActiveTab('vet')}
        >
          <Text>Vet Visits</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'weight' && (
        <View style={styles.form}>
          <TextInput
            label="Weight (grams)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={addWeightRecord} style={styles.button}>
            Add Weight Record
          </Button>
        </View>
      )}

      {activeTab === 'symptoms' && (
        <View style={styles.form}>
          <TextInput
            label="Symptom (e.g., sneezing, lethargy)"
            value={symptom}
            onChangeText={setSymptom}
            style={styles.input}
          />
          <Button mode="contained" onPress={addSymptomRecord} style={styles.button}>
            Log Symptom
          </Button>
        </View>
      )}

      {activeTab === 'vet' && (
        <View style={styles.form}>
          <TextInput
            label="Vet Visit Notes"
            value={vetNotes}
            onChangeText={setVetNotes}
            multiline
            style={[styles.input, { height: 100 }]}
          />
          <Button mode="contained" onPress={addVetRecord} style={styles.button}>
            Add Vet Record
          </Button>
        </View>
      )}

      <FlatList
        data={records.filter(r => r.type === activeTab)}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8E1',
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
    paddingBottom: 20,
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
});

export default HealthTrackerScreen;