import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddEditPetScreen from '../screens/AddEditPetScreen';

const Stack = createNativeStackNavigator();

// Mock navigation and route props
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    mode: 'add',
  },
};

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'images',
  },
}));

const TestWrapper = ({ children }) => (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Test" component={() => children} />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
);

describe('AddEditPetScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in add mode', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <AddEditPetScreen
          navigation={mockNavigation as any}
          route={mockRoute as any}
        />
      </TestWrapper>
    );

    expect(getByTestId('add-edit-screen')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <AddEditPetScreen
          navigation={mockNavigation as any}
          route={mockRoute as any}
        />
      </TestWrapper>
    );

    fireEvent.press(getByTestId('back-button'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('shows and hides gender modal when gender field is pressed', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <AddEditPetScreen
          navigation={mockNavigation as any}
          route={mockRoute as any}
        />
      </TestWrapper>
    );

    const modal = getByTestId('gender-modal');
    expect(modal.props.visible).toBe(false);
    
    fireEvent.press(getByTestId('gender-field'));
    expect(modal.props.visible).toBe(true);
    
    // Test closing the modal
    fireEvent.press(getByTestId('gender-modal-backdrop'));
    expect(modal.props.visible).toBe(false);
  });
}); 