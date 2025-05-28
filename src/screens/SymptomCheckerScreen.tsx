import { RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'SymptomChecker'>;

interface SymptomResult {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  action?: string;
}

type Symptoms = Record<string, SymptomResult[]>;

const symptoms: Symptoms = {
  'Loss of Appetite': [
    {
      title: 'Dental Problems',
      description: 'Guinea pigs teeth grow continuously and can develop problems that make eating painful.',
      severity: 'high',
      action: 'Schedule a vet check-up to examine teeth',
    },
    {
      title: 'Stress or Environmental Changes',
      description: 'Recent changes in environment or routine can affect appetite.',
      severity: 'medium',
      action: 'Maintain consistent routine and quiet environment',
    },
  ],
  'Lethargy/Weakness': [
    {
      title: 'Vitamin C Deficiency',
      description: 'Guinea pigs cannot produce their own Vitamin C and need it from their diet.',
      severity: 'high',
      action: 'Increase Vitamin C rich foods and consider supplements',
    },
    {
      title: 'Illness or Infection',
      description: 'General weakness can be a sign of various health issues.',
      severity: 'high',
      action: 'Take to vet for examination',
    },
  ],
  'Diarrhea': [
    {
      title: 'Diet Changes',
      description: 'Sudden changes in diet can cause digestive issues.',
      severity: 'medium',
      action: 'Return to normal diet and introduce new foods gradually',
    },
    {
      title: 'Bacterial Infection',
      description: 'Can be caused by harmful bacteria in the digestive system.',
      severity: 'high',
      action: 'Seek immediate veterinary care',
    },
  ],
  'Hair Loss': [
    {
      title: 'Mites or Parasites',
      description: 'External parasites can cause itching and hair loss.',
      severity: 'medium',
      action: 'Visit vet for proper diagnosis and treatment',
    },
    {
      title: 'Vitamin C Deficiency',
      description: 'Poor coat condition can be related to vitamin deficiency.',
      severity: 'medium',
      action: 'Increase Vitamin C intake and consult vet',
    },
  ],
  'Wheezing/Breathing Issues': [
    {
      title: 'Upper Respiratory Infection',
      description: 'Common in guinea pigs, can be caused by bacteria or viruses.',
      severity: 'high',
      action: 'Seek immediate veterinary care',
    },
    {
      title: 'Environmental Irritants',
      description: 'Dusty bedding or poor ventilation can cause breathing problems.',
      severity: 'medium',
      action: 'Change bedding and improve air quality',
    },
  ],
  'Weight Loss': [
    {
      title: 'Dental Disease',
      description: 'Difficulty eating due to dental problems can cause weight loss.',
      severity: 'high',
      action: 'Schedule dental check with vet',
    },
    {
      title: 'Underlying Health Issue',
      description: 'Weight loss can be a symptom of various health problems.',
      severity: 'high',
      action: 'Take to vet for thorough examination',
    },
  ],
  'Limping/Mobility Issues': [
    {
      title: 'Injury',
      description: 'Could be from falls or improper handling.',
      severity: 'high',
      action: 'Keep guinea pig calm and see vet immediately',
    },
    {
      title: 'Arthritis',
      description: 'Common in older guinea pigs.',
      severity: 'medium',
      action: 'Consult vet for pain management options',
    },
  ],
  'Excessive Drooling': [
    {
      title: 'Dental Problems',
      description: 'Overgrown teeth or dental disease can cause drooling.',
      severity: 'high',
      action: 'Schedule dental examination with vet',
    },
    {
      title: 'Mouth Injury',
      description: 'Cuts or sores in mouth can cause drooling.',
      severity: 'medium',
      action: 'Check mouth for injuries and consult vet',
    },
  ],
};

const SymptomCheckerScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      setSelectedSymptom(null);
    } else {
      navigation.goBack();
    }
  };

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    setShowResults(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <Text style={styles.title}>Symptom Checker</Text>
        </View>
        <Text style={styles.subtitle}>
          {showResults ? 'Possible Causes' : 'Select a Symptom'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {!showResults ? (
          <View style={styles.symptomList}>
            {Object.keys(symptoms).map((symptom) => (
              <TouchableOpacity
                key={symptom}
                style={[styles.symptomButton, { backgroundColor: colors.background.card }]}
                onPress={() => handleSymptomSelect(symptom)}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.accent.primary + '15' }]}>
                  <MaterialIcons name="medical-services" size={24} color={colors.accent.primary} />
                </View>
                <Text style={[styles.buttonTitle, { color: colors.text.primary }]}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : selectedSymptom ? (
          <View style={styles.resultsList}>
            {symptoms[selectedSymptom]?.map((result: SymptomResult, index: number) => (
              <View 
                key={index} 
                style={[styles.resultCard, { backgroundColor: colors.background.card }]}
              >
                <View style={styles.resultHeader}>
                  <MaterialIcons 
                    name={result.severity === 'high' ? 'warning' : 'info'} 
                    size={24} 
                    color={result.severity === 'high' ? colors.buttons.red : colors.primary.DEFAULT} 
                  />
                  <Text style={[styles.resultTitle, { 
                    color: result.severity === 'high' ? colors.buttons.red : colors.primary.DEFAULT 
                  }]}>
                    {result.title}
                  </Text>
                </View>
                <Text style={[styles.resultDescription, { color: colors.text.primary }]}>
                  {result.description}
                </Text>
                {result.action && (
                  <View style={styles.actionContainer}>
                    <MaterialIcons name="healing" size={20} color={colors.primary.DEFAULT} />
                    <Text style={[styles.actionText, { color: colors.text.primary }]}>
                      {result.action}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.disclaimer, { backgroundColor: colors.primary.DEFAULT + '05' }]}>
        <MaterialIcons name="info" size={20} color={colors.primary.DEFAULT} />
        <Text style={[styles.disclaimerText, { color: colors.primary.DEFAULT + '99' }]}>
          This is a guide only. Always consult a vet for proper diagnosis and treatment.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.DEFAULT,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    padding: 16
  },
  symptomList: {
    flexDirection: 'column',
    gap: 12
  },
  symptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  resultsList: {
    flexDirection: 'column',
    gap: 16
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  resultDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});

export default SymptomCheckerScreen; 