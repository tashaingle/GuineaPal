const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: '#d6833e', // Caramel
    light: '#de9b64',
    dark: '#8a4414', // Russet
  },
  
  // Secondary colors
  secondary: {
    DEFAULT: '#d37436', // Cocoa Brown
    light: '#dc915e',
    dark: '#82451d',
  },

  // Background colors
  background: {
    DEFAULT: '#FFF8E1', // Dutch white - main background
    card: '#FFFFFF', // White - card backgrounds
    elevated: '#FFFFFF', // White - elevated elements
  },

  // Text colors
  text: {
    primary: '#8a4414', // Russet - primary text
    secondary: '#d6833e', // Caramel - secondary text
    muted: '#e6b48b', // Caramel-700 - muted text
  },

  // Accent colors
  accent: {
    primary: '#f3aa5d', // Sandy brown
    secondary: '#d37436', // Cocoa Brown
  },

  // Status colors
  status: {
    success: '#84cc16', // Green
    warning: '#f3aa5d', // Sandy brown
    error: '#dc2626', // Red
    info: '#d37436', // Cocoa Brown
  },

  // Button colors
  buttons: {
    primary: '#d6833e', // Caramel
    secondary: '#d37436', // Cocoa Brown
    red: '#dc2626',
    green: '#84cc16',
    blue: '#0ea5e9',
    brown: '#8a4414', // Russet
    orange: '#f3aa5d', // Sandy brown
  },

  // Border colors
  border: {
    light: '#fef1d7', // Papaya whip-600
    DEFAULT: '#de9b64', // Caramel-600
    dark: '#8a4414', // Russet
  },

  // Utility colors
  white: '#ffffff',
  black: '#000000',

  // Semantic color mapping
  urgency: {
    low: '#84cc16', // Green
    medium: '#f3aa5d', // Sandy brown
    high: '#dc2626', // Red
  },

  // Color variations for components
  components: {
    card: {
      background: '#feedcc', // Papaya whip
      border: '#fef1d7', // Papaya whip-600
      shadow: 'rgba(138, 68, 20, 0.1)', // Russet with opacity
    },
    input: {
      background: '#ffffff',
      border: '#de9b64', // Caramel-600
      placeholder: '#e6b48b', // Caramel-700
    },
    header: {
      background: '#d6833e', // Caramel
      text: '#ffffff',
    },
  }
};

export default colors; 