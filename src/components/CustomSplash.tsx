import colors from '@/theme/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CustomSplash = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
});

export default CustomSplash; 