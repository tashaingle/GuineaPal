import * as SplashScreen from 'expo-splash-screen';

// Configure splash screen
SplashScreen.preventAutoHideAsync()
  .catch(() => {
    /* reloading the app might trigger some race conditions, ignore them */
  });

// Function to hide the splash screen
export const hideSplashScreen = async () => {
  try {
    // Ensure the background color is set
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = '#FFF8E1';
    }
    await SplashScreen.hideAsync();
  } catch (e) {
    console.warn('Error hiding splash screen:', e);
  }
}; 