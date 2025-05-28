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

type Props = NativeStackScreenProps<RootStackParamList, 'SafeFoods'>;

const FOOD_GUIDE = {
  safe: {
    vegetables: [
      'Bell Peppers (high in Vitamin C)',
      'Carrots (limit due to sugar content)',
      'Cucumber',
      'Romaine Lettuce',
      'Parsley',
      'Cilantro',
      'Celery',
      'Zucchini',
      'Green Beans',
      'Spinach (in moderation)',
    ],
    fruits: [
      'Apple (no seeds)',
      'Strawberries',
      'Blueberries',
      'Melon',
      'Kiwi',
      'Orange (occasional treat)',
      'Pear (ripe)',
    ],
    herbs: [
      'Basil',
      'Dill',
      'Mint',
      'Oregano',
      'Thyme',
    ],
  },
  unsafe: {
    vegetables: [
      'Iceberg Lettuce',
      'Onions',
      'Garlic',
      'Mushrooms',
      'Potato',
      'Raw Beans',
      'Rhubarb',
    ],
    fruits: [
      'Avocado',
      'Apple Seeds',
      'Fruit Pits/Seeds',
      'Citrus Peels',
    ],
    other: [
      'Chocolate',
      'Dairy Products',
      'Nuts',
      'Seeds',
      'Human Food/Snacks',
      'Processed Foods',
      'Bread/Grains',
    ],
  },
};

const SafeFoodsScreen: React.FC<Props> = ({ navigation }) => {
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
          <Text style={styles.title}>Safe & Unsafe Foods</Text>
        </View>
        <Text style={styles.subtitle}>
          Guide to what your guinea pig can and cannot eat
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Safe Foods Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name="check-circle" size={24} color={colors.primary.DEFAULT} />
              <Text style={styles.cardTitle}>Safe Foods</Text>
            </View>
            
            <Text style={styles.categoryTitle}>Vegetables</Text>
            {FOOD_GUIDE.safe.vegetables.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <MaterialIcons name="check" size={16} color={colors.primary.DEFAULT} />
                <Text style={styles.foodText}>{food}</Text>
              </View>
            ))}

            <Text style={styles.categoryTitle}>Fruits (as treats)</Text>
            {FOOD_GUIDE.safe.fruits.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <MaterialIcons name="check" size={16} color={colors.primary.DEFAULT} />
                <Text style={styles.foodText}>{food}</Text>
              </View>
            ))}

            <Text style={styles.categoryTitle}>Herbs</Text>
            {FOOD_GUIDE.safe.herbs.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <MaterialIcons name="check" size={16} color={colors.primary.DEFAULT} />
                <Text style={styles.foodText}>{food}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Unsafe Foods Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name="warning" size={24} color={colors.buttons.red} />
              <Text style={[styles.cardTitle, { color: colors.buttons.red }]}>Unsafe Foods</Text>
            </View>

            <Text style={styles.categoryTitle}>Vegetables</Text>
            {FOOD_GUIDE.unsafe.vegetables.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <MaterialIcons name="close" size={16} color={colors.buttons.red} />
                <Text style={styles.foodText}>{food}</Text>
              </View>
            ))}

            <Text style={styles.categoryTitle}>Fruits</Text>
            {FOOD_GUIDE.unsafe.fruits.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <MaterialIcons name="close" size={16} color={colors.buttons.red} />
                <Text style={styles.foodText}>{food}</Text>
              </View>
            ))}

            <Text style={styles.categoryTitle}>Other</Text>
            {FOOD_GUIDE.unsafe.other.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <MaterialIcons name="close" size={16} color={colors.buttons.red} />
                <Text style={styles.foodText}>{food}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Important Notes */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialIcons name="info" size={24} color={colors.primary.DEFAULT} />
              <Text style={styles.cardTitle}>Important Notes</Text>
            </View>
            <View style={styles.noteItem}>
              <MaterialIcons name="info" size={16} color={colors.primary.DEFAULT} />
              <Text style={styles.noteText}>Always introduce new foods gradually</Text>
            </View>
            <View style={styles.noteItem}>
              <MaterialIcons name="info" size={16} color={colors.primary.DEFAULT} />
              <Text style={styles.noteText}>Wash all produce thoroughly before feeding</Text>
            </View>
            <View style={styles.noteItem}>
              <MaterialIcons name="info" size={16} color={colors.primary.DEFAULT} />
              <Text style={styles.noteText}>Remove uneaten fresh foods after 4 hours</Text>
            </View>
            <View style={styles.noteItem}>
              <MaterialIcons name="info" size={16} color={colors.primary.DEFAULT} />
              <Text style={styles.noteText}>Hay should make up 80% of their diet</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: colors.primary.DEFAULT,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
    marginTop: 12,
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  foodText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 8,
  },
  noteText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
});

export default SafeFoodsScreen; 