import ApiClient from '../utils/api-client.js';
// core/auth.js
class AuthService {
  static async login(email, password) {
    try {
      const response = await ApiClient.post('/auth/login', {
        email,
        password
      });

      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        return response.user;
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  static async register(userData) {
    try {
      const response = await ApiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  static async validateToken(token) {
    try {
      const response = await ApiClient.get('/auth/validate', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login.html';
  }

  static getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
}

export default AuthService;
