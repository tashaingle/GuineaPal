import { CARE_GUIDE_CONTENT } from '@/data/careGuideContent';
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

interface Section {
  title: string;
  text: string[];
  tips?: string[];
  warnings?: string[];
}

interface GuideSection {
  title: string;
  content: Section[];
}

type CareGuideContent = Record<string, GuideSection>;

type Props = NativeStackScreenProps<RootStackParamList, 'CareGuideSection'>;

const CareGuideSectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const sectionData = (CARE_GUIDE_CONTENT as CareGuideContent)[route.params.sectionId];

  if (!sectionData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
            <Text style={styles.title}>Section Not Found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <Text style={styles.title}>{sectionData.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {sectionData.content.map((section: Section, index: number) => (
          <Card 
            key={index} 
            style={[styles.card, { backgroundColor: colors.white }]}
          >
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                {section.title}
              </Text>
              
              {section.text.map((paragraph: string, pIndex: number) => (
                <Text key={pIndex} style={[styles.paragraph, { color: colors.text.secondary }]}>
                  {paragraph}
                </Text>
              ))}

              {section.tips && (
                <View style={styles.tipsContainer}>
                  <Text style={[styles.tipsTitle, { color: colors.accent.secondary }]}>
                    Tips:
                  </Text>
                  {section.tips.map((tip: string, tIndex: number) => (
                    <View key={tIndex} style={styles.tipRow}>
                      <MaterialIcons 
                        name="check-circle" 
                        size={16} 
                        color={colors.accent.secondary} 
                      />
                      <Text style={[styles.tipText, { color: colors.text.secondary }]}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {section.warnings && (
                <View style={styles.warningsContainer}>
                  <Text style={[styles.warningsTitle, { color: colors.buttons.red }]}>
                    Important:
                  </Text>
                  {section.warnings.map((warning: string, wIndex: number) => (
                    <View key={wIndex} style={styles.warningRow}>
                      <MaterialIcons 
                        name="warning" 
                        size={16} 
                        color={colors.buttons.red} 
                      />
                      <Text style={[styles.warningText, { color: colors.text.secondary }]}>{warning}</Text>
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
    backgroundColor: colors.background.DEFAULT
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
    alignItems: 'center'
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.DEFAULT,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24
  },
  tipsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.accent.secondary + '08',
    borderRadius: 8
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  tipText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1
  },
  warningsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.buttons.red + '08',
    borderRadius: 8
  },
  warningsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  warningText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1
  }
});

export default CareGuideSectionScreen; 