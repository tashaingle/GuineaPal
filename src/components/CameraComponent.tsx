import { Camera, CameraProps } from 'expo-camera';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CameraComponentProps extends Omit<CameraProps, 'style'> {
  children?: React.ReactNode;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ type, children, ...props }) => {
  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera}
        type={type}
        {...props}
      >
        {children}
      </Camera>
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
}); 