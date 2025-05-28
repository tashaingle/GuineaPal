import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

const AUTH_TOKEN_KEY = '@guinea_pal_auth_token';
const USER_KEY = '@guinea_pal_user';

// Mock user storage for development
const MOCK_USERS_KEY = '@guinea_pal_mock_users';

// Default test account
const DEFAULT_TEST_USER: User = {
  id: '1',
  email: 'test@guineapal.com',
  username: 'testuser',
  password: 'password123',
  createdAt: new Date().toISOString()
};

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    // Initialize mock data when service is created
    this.initializeMockData();
  }

  private async initializeMockData() {
    try {
      const existingUsers = await this.getMockUsers();
      if (existingUsers.length === 0) {
        // If no users exist, add the test user
        await this.saveMockUsers([DEFAULT_TEST_USER]);
      }
    } catch (error) {
      console.error('Failed to initialize mock data:', error);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async getMockUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(MOCK_USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error reading mock users:', error);
      return [];
    }
  }

  private async saveMockUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async resetAuthData(): Promise<void> {
    try {
      // Clear all auth-related data
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_KEY, MOCK_USERS_KEY]);
      this.token = null;
      this.user = null;
      
      // Reinitialize with default test user
      await this.initializeMockData();
    } catch (error) {
      console.error('Failed to reset auth data:', error);
      throw new Error('Failed to reset auth data. Please try again.');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const users = await this.getMockUsers();
      
      if (users.length === 0) {
        throw new Error('No accounts found. Please create an account first.');
      }

      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        throw new Error('No account found with this email address.');
      }

      if (user.password !== credentials.password) {
        throw new Error('Incorrect password. Please try again.');
      }

      const token = this.generateToken();
      await this.setToken(token);
      await this.setUser(user);

      return { user, token };
    } catch (error) {
      // Rethrow specific errors
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const users = await this.getMockUsers();
      
      // Check if email already exists
      if (users.some(u => u.email === credentials.email)) {
        throw new Error('Email already registered');
      }

      // Check if username already exists
      if (users.some(u => u.username === credentials.username)) {
        throw new Error('Username already taken');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        username: credentials.username,
        password: credentials.password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await this.saveMockUsers(users);

      const token = this.generateToken();
      await this.setToken(token);
      await this.setUser(newUser);

      return { user: newUser, token };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_KEY]);
      this.token = null;
      this.user = null;
    } catch (error) {
      throw new Error('Logout failed. Please try again.');
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    }
    return this.token;
  }

  async getUser(): Promise<User | null> {
    if (!this.user) {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      this.user = userJson ? JSON.parse(userJson) : null;
    }
    return this.user;
  }

  private async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    this.token = token;
  }

  private async setUser(user: User): Promise<void> {
    const { password, ...userWithoutPassword } = user;
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
    this.user = userWithoutPassword;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async syncData(): Promise<void> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Mock implementation - no actual syncing needed for development
    return Promise.resolve();
  }
}

export default AuthService.getInstance(); 