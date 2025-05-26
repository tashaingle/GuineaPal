declare module 'expo-camera' {
  import React from 'react';
    import { ViewProps } from 'react-native';

  export type CameraType = 0 | 1;

  export interface CameraProps extends ViewProps {
    type: CameraType;
    style?: any;
  }

  export const Camera: React.ComponentType<CameraProps> & {
    requestCameraPermissionsAsync(): Promise<{ status: string }>;
  };
} 