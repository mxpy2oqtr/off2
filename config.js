const AppConfig = {
  // API
  API_BASE_URL: 'https://api.healthtrack.com/v1',

  // App
  APP_NAME: 'HealthTrack',
  APP_VERSION: '1.0.0',

  // Features
  FEATURES: {
    OFFLINE_MODE: true,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC_AUTH: false
  },

  // Limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos

  // Defaults
  DEFAULTS: {
    DAILY_STEPS_GOAL: 10000,
    DAILY_WATER_GOAL: 2000, // ml
    DAILY_SLEEP_GOAL: 8 // horas
  }
};

// Export para uso global

export default AppConfig;
