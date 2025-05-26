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
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'SymptomChecker'>;

interface SymptomResult {
  condition: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  advice: string;
}

type Symptoms = {
  [key: string]: SymptomResult[];
};

const symptoms: Symptoms = {
  'Not Eating': [
    {
      condition: 'Dental Problems',
      description: 'Overgrown teeth or dental disease can make eating painful',
      urgency: 'high',
      advice: 'Check teeth length and alignment. Visit a vet if teeth appear overgrown or misaligned.'
    },
    {
      condition: 'GI Stasis',
      description: 'Slowing or stopping of the digestive system',
      urgency: 'high',
      advice: 'Immediate vet attention needed. This is an emergency condition.'
    },
    {
      condition: 'Stress',
      description: 'Environmental changes or stressors affecting appetite',
      urgency: 'medium',
      advice: 'Check for recent changes in environment, loud noises, or new pets.'
    }
  ],
  'Lethargy': [
    {
      condition: 'Vitamin C Deficiency',
      description: 'Lack of essential Vitamin C in diet',
      urgency: 'medium',
      advice: 'Ensure fresh vegetables high in Vitamin C are provided daily.'
    },
    {
      condition: 'Illness/Infection',
      description: 'Various infections can cause low energy',
      urgency: 'high',
      advice: 'Monitor temperature and other symptoms. Consult vet if condition persists.'
    }
  ],
  'Weight Loss': [
    {
      condition: 'Malocclusion',
      description: 'Teeth misalignment affecting eating ability',
      urgency: 'high',
      advice: 'Requires vet check and possible teeth trimming.'
    },
    {
      condition: 'Parasites',
      description: 'Internal parasites affecting nutrition absorption',
      urgency: 'medium',
      advice: 'Vet visit needed for proper diagnosis and treatment.'
    }
  ],
  'Diarrhea': [
    {
      condition: 'Diet Changes',
      description: 'Sudden changes in food or too many fresh vegetables',
      urgency: 'medium',
      advice: 'Return to normal diet, reduce fresh vegetables temporarily.'
    },
    {
      condition: 'Bacterial Infection',
      description: 'Infection causing digestive issues',
      urgency: 'high',
      advice: 'Vet visit needed. Keep pig hydrated and warm.'
    }
  ],
  'Hair Loss': [
    {
      condition: 'Mites',
      description: 'Parasitic mites causing itching and hair loss',
      urgency: 'medium',
      advice: 'Vet visit needed for proper treatment. May be contagious to other pigs.'
    },
    {
      condition: 'Vitamin Deficiency',
      description: 'Lack of essential nutrients affecting coat health',
      urgency: 'medium',
      advice: 'Review diet and supplements. Ensure balanced nutrition.'
    }
  ],
  'Wheezing/Breathing Issues': [
    {
      condition: 'Upper Respiratory Infection',
      description: 'Bacterial or viral infection affecting breathing',
      urgency: 'high',
      advice: 'Immediate vet attention needed. Keep pig warm and reduce stress.'
    },
    {
      condition: 'Allergies',
      description: 'Environmental allergens causing respiratory issues',
      urgency: 'medium',
      advice: 'Check bedding type, dust levels, and air quality.'
    }
  ]
};

const SymptomCheckerScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    setShowResults(true);
  };

  const handleBack = () => {
    if (showResults) {
      setSelectedSymptom(null);
      setShowResults(false);
    } else {
      navigation.goBack();
    }
  };

  const renderUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <MaterialIcons name="error" size={24} color="#D32F2F" />;
      case 'medium':
        return <MaterialIcons name="warning" size={24} color="#FFA000" />;
      default:
        return <MaterialIcons name="info" size={24} color="#1976D2" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.buttons.cyan + '10' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.cyan} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.buttons.cyan }]}>Symptom Checker</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.buttons.cyan + '99' }]}>
          {showResults ? 'Possible Causes' : 'Select a Symptom'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {!showResults ? (
          <View style={styles.symptomList}>
            {Object.keys(symptoms).map((symptom) => (
              <TouchableOpacity
                key={symptom}
                style={[styles.symptomButton, { backgroundColor: colors.buttons.cyan + '10' }]}
                onPress={() => handleSymptomSelect(symptom)}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.buttons.cyan + '20' }]}>
                  <MaterialIcons name="medical-services" size={24} color={colors.buttons.cyan} />
                </View>
                <Text style={[styles.buttonTitle, { color: colors.buttons.cyan }]}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.results}>
            {selectedSymptom && symptoms[selectedSymptom]?.map((result, index) => (
              <View 
                key={index} 
                style={[styles.resultCard, { backgroundColor: colors.buttons.cyan + '10' }]}
              >
                <View style={styles.resultHeader}>
                  {renderUrgencyIcon(result.urgency)}
                  <Text style={[styles.conditionText, { color: colors.buttons.cyan }]}>
                    {result.condition}
                  </Text>
                </View>
                <Text style={[styles.descriptionText, { color: colors.buttons.cyan + '99' }]}>
                  {result.description}
                </Text>
                <Text style={[styles.adviceText, { color: colors.buttons.cyan + 'CC' }]}>
                  {result.advice}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.disclaimer, { backgroundColor: colors.buttons.cyan + '05' }]}>
        <MaterialIcons name="info" size={20} color={colors.buttons.cyan} />
        <Text style={[styles.disclaimerText, { color: colors.buttons.cyan + '99' }]}>
          This is a guide only. Always consult a vet for proper diagnosis and treatment.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    color: '#5D4037',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D6E63',
  },
  content: {
    flex: 1,
  },
  symptomList: {
    padding: 16,
  },
  symptomButton: {
    marginBottom: 12,
  },
  results: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conditionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default SymptomCheckerScreen; 