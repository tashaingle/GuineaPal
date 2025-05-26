module.exports = {
  expo: {
    name: 'GuineaPal',
    slug: 'GuineaPal',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    jsEngine: 'hermes',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FFF8E1'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      bundleIdentifier: 'com.tasha.guineapal',
      buildNumber: '1.0.0',
      supportsTablet: true,
      jsEngine: 'hermes',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#FFF8E1',
        dark: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#FFF8E1'
        }
      },
      infoPlist: {
        NSCameraUsageDescription: 'Allow GuineaPal to access your camera to take photos of your guinea pigs.',
        NSPhotoLibraryUsageDescription: 'Allow GuineaPal to access your photos to upload pet pictures',
        NSPhotoLibraryAddUsageDescription: 'Allow GuineaPal to save photos to your library',
        NSMicrophoneUsageDescription: 'Allow GuineaPal to access microphone for video recording',
        UIUserInterfaceStyle: 'Automatic',
        UIBackgroundModes: ['audio']
      }
    },
    android: {
      package: 'com.tasha.guineapal',
      versionCode: 1,
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'ACCESS_MEDIA_LOCATION',
        'RECORD_AUDIO',
        'android.permission.CAMERA',
        'android.permission.MODIFY_AUDIO_SETTINGS'
      ],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      softwareKeyboardLayoutMode: 'pan',
      statusBar: {
        hidden: false,
        translucent: false
      }
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro'
    },
    plugins: [
      'expo-splash-screen',
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow GuineaPal to access your photos to upload pet pictures',
          cameraPermission: 'Allow GuineaPal to use your camera to take pet photos'
        }
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#5D4037',
          androidCollapsedTitle: 'GuineaPal Alerts'
        }
      ],
      [
        'expo-av',
        {
          microphonePermission: 'Allow GuineaPal to access your microphone.'
        }
      ]
    ],
    extra: {
      eas: {
        projectId: 'd149b9fe-85ba-43b2-9577-b176594a069a'
      }
    },
    runtimeVersion: {
      policy: 'appVersion'
    },
    updates: {
      enabled: true,
      fallbackToCacheTimeout: 30000,
      checkAutomatically: 'ON_LOAD'
    },
    owner: 'tashaingle'
  }
}; 