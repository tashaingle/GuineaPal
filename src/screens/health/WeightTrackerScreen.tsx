import BaseScreen from '@/components/BaseScreen';
import { RootStackParamList, WeightRecord } from '@/navigation/types';
import { loadWeightRecords, saveWeightRecord } from '@/utils/petStorage';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WeightTrackerScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WeightTracker'>>();
  const navigation = useNavigation<NavigationProp>();
  const { pet } = route.params;

  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const records = await loadWeightRecords(pet.id);
      setWeightRecords(records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error('Failed to load weight records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    try {
      const weightRecord: WeightRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        weight: Number(newWeight),
        notes: notes.trim()
      };

      await saveWeightRecord(pet.id, weightRecord);
      setWeightRecords([...weightRecords, weightRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setShowAddModal(false);
      setNewWeight('');
      setNotes('');
    } catch (error) {
      console.error('Failed to save weight record:', error);
      Alert.alert('Error', 'Failed to save weight record');
    }
  };

  const renderWeightRecord = ({ item }: { item: WeightRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.recordWeight}>{item.weight}g</Text>
      </View>
      {item.notes && (
        <Text style={styles.recordNotes}>{item.notes}</Text>
      )}
    </View>
  );

  const renderChart = () => {
    if (weightRecords.length < 2) return null;

    const data = {
      labels: weightRecords.map(record => 
        new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        data: weightRecords.map(record => record.weight)
      }]
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weight Trend</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={data}
            width={Math.max(Dimensions.get('window').width - 32, data.labels.length * 60)}
            height={220}
            chartConfig={{
              backgroundColor: '#FFF8E1',
              backgroundGradientFrom: '#FFF8E1',
              backgroundGradientTo: '#FFF8E1',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(93, 64, 55, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(93, 64, 55, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#5D4037'
              }
            }}
            bezier
            style={styles.chart}
          />
        </ScrollView>
      </View>
    );
  };

  return (
    <BaseScreen
      title={`${pet.name}'s Weight History`}
      rightIcon="add"
      onRightPress={() => setShowAddModal(true)}
    >
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <MaterialIcons name="hourglass-empty" size={48} color="#5D4037" />
            <Text style={styles.loadingText}>Loading weight records...</Text>
          </View>
        ) : weightRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="scale" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>No weight records yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first weight record
            </Text>
          </View>
        ) : (
          <>
            {renderChart()}
            <FlatList
              data={[...weightRecords].reverse()}
              renderItem={renderWeightRecord}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}

        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Weight Record</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (in grams)</Text>
                <TextInput
                  style={styles.input}
                  value={newWeight}
                  onChangeText={setNewWeight}
                  keyboardType="numeric"
                  placeholder="Enter weight in grams"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any notes about the weight"
                  multiline
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddWeight}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1'
  },
  chartContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listContent: {
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5D4037'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center'
  },
  recordItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  recordDate: {
    fontSize: 16,
    color: '#5D4037'
  },
  recordWeight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037'
  },
  recordNotes: {
    fontSize: 14,
    color: '#795548',
    fontStyle: 'italic'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 24
  },
  inputContainer: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 12
  },
  cancelButton: {
    backgroundColor: '#E0E0E0'
  },
  saveButton: {
    backgroundColor: '#5D4037'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  saveButtonText: {
    color: 'white'
  }
});

export default WeightTrackerScreen; 