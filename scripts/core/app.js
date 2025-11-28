import AuthService from './auth.js';
import TabsSystem from '../components/TabsSystem.js';
import ModalManager from '../components/ModalManager.js';
import Notifications from '../components/Notifications.js';
// core/app.js
class HealthTrackApp {
  constructor() {
    this.currentUser = null;
    this.currentPage = 'dashboard';
    this.init();
  }

  async init() {
    try {
      // Verificar autenticación
      await this.checkAuth();

      // Inicializar componentes
      this.initComponents();

      // Configurar navegación
      this.setupNavigation();

      // Cargar página inicial
      await this.loadPage(this.currentPage);

      console.log('HealthTrack App initialized successfully');
    } catch (error) {
      console.error('App initialization failed:', error);
      this.handleError(error);
    }
  }

  async checkAuth() {
    // For development purposes, we'll simulate a logged-in user.
    // In a real application, you would have a proper authentication flow.
    this.currentUser = {
      name: 'Demo User',
      email: 'demo@healthtrack.com'
    };
    console.log('Authentication check skipped for development. Logged in as Demo User.');
    return Promise.resolve();
  }

  initComponents() {
    // Inicializar sistema de pestañas
    if (typeof TabsSystem !== 'undefined') {
      new TabsSystem();
    }

    // Inicializar modal manager
    if (typeof ModalManager !== 'undefined') {
      new ModalManager();
    }

    // Inicializar notificaciones
    if (typeof Notifications !== 'undefined') {
      new Notifications();
    }
  }

  setupNavigation() {
    // Navegación SPA
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.navigateTo(page);
      }
    });

    // Manejar navegación del browser
    window.addEventListener('popstate', (e) => {
      const page = window.location.hash.replace('#', '') || 'dashboard';
      this.loadPage(page);
    });
  }

  async navigateTo(page) {
    if (this.currentPage === page) return;

    // Actualizar URL
    window.history.pushState({}, '', `#${page}`);

    // Cargar nueva página
    await this.loadPage(page);
    this.currentPage = page;
  }

  async loadPage(page) {
    try {
      // Mostrar loading
      this.showLoading();

      // Cargar módulo de la página
      const pageModule = await import(`../../pages/${page}.js`);

      // Renderizar página
      await pageModule.default.render();

      // Ocultar loading
      this.hideLoading();

    } catch (error) {
      console.error(`Error loading page ${page}:`, error);
      this.handleError(error);
    }
  }

  showLoading() {
    // Implementar overlay de loading
  }

  hideLoading() {
    // Ocultar overlay de loading
  }

  handleError(error) {
    // Manejo centralizado de errores
    console.error('Application error:', error);

    if (error.status === 401) {
      this.redirectToLogin();
    } else {
      // Mostrar notificación de error
      if (typeof Notifications !== 'undefined') {
        Notifications.show('Error', error.message, 'error');
      }
    }
  }

  redirectToLogin() {
    window.location.href = '/login.html';
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.HealthTrackApp = new HealthTrackApp();
});
