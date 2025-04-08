// Environment configuration
const env = {
  development: {
    API_URL: 'http://localhost:5000/api'
  },
  production: {
    API_URL: process.env.VITE_API_URL || 'https://your-backend-url.herokuapp.com/api'
  }
};

const getEnvConfig = () => {
  const environment = import.meta.env.MODE || 'development';
  return env[environment];
};

export const config = getEnvConfig();