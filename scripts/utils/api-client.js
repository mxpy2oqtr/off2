// utils/api-client.js
class ApiClient {
  static baseURL = 'https://api.healthtrack.com/v1';

  static async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async handleError(response) {
    const errorData = await response.json().catch(() => ({}));

    const error = new Error(errorData.message || 'API request failed');
    error.status = response.status;
    error.data = errorData;

    return error;
  }

  static async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default ApiClient;
