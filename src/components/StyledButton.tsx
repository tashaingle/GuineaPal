import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface StyledButtonProps {
  title: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  color: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  icon,
  color,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color + '10' },
        style
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <MaterialIcons name={icon} size={24} color={color} />
          </View>
        )}
        <Text style={[styles.text, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StyledButton; 