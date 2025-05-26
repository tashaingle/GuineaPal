import { RootStackParamList } from '@/navigation/types';
import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'CareGuideSection'>;

const CareGuideSectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { title, content } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.buttons.purple + '10' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.buttons.purple} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.buttons.purple }]}>{title}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {content.map((section, index) => (
          <Card 
            key={index} 
            style={[styles.card, { backgroundColor: colors.buttons.purple + '10' }]}
          >
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.buttons.purple }]}>
                {section.title}
              </Text>
              
              {section.text.map((paragraph, pIndex) => (
                <Text key={pIndex} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}

              {section.tips && (
                <View style={styles.tipsContainer}>
                  <Text style={[styles.tipsTitle, { color: colors.buttons.green }]}>
                    Tips:
                  </Text>
                  {section.tips.map((tip, tIndex) => (
                    <View key={tIndex} style={styles.tipRow}>
                      <MaterialIcons 
                        name="check-circle" 
                        size={16} 
                        color={colors.buttons.green} 
                      />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {section.warnings && (
                <View style={styles.warningsContainer}>
                  <Text style={[styles.warningsTitle, { color: colors.buttons.red }]}>
                    Important:
                  </Text>
                  {section.warnings.map((warning, wIndex) => (
                    <View key={wIndex} style={styles.warningRow}>
                      <MaterialIcons 
                        name="warning" 
                        size={16} 
                        color={colors.buttons.red} 
                      />
                      <Text style={styles.warningText}>{warning}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  tipsContainer: {
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  warningsContainer: {
    marginTop: 16,
  },
  warningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
});

export default CareGuideSectionScreen; 