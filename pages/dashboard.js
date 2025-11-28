import ComponentLoader from '../scripts/utils/component-loader.js';
import ApiClient from '../scripts/utils/api-client.js';
// pages/dashboard.js
class DashboardPage {
  static async render() {
    await this.loadComponents();
    await this.loadData();
    this.initCharts();
    this.setupEventListeners();
  }

  static async loadComponents() {
    // Cargar componentes reutilizables
    await ComponentLoader.load('header', 'header-container');
    await ComponentLoader.load('navigation', 'nav-container');
    await ComponentLoader.load('footer', 'footer-container');
  }

  static async loadData() {
    try {
      const [metrics, activities] = await Promise.all([
        ApiClient.get('/metrics/summary'),
        ApiClient.get('/activities/recent')
      ]);

      this.renderMetrics(metrics);
      this.renderRecentActivities(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  static renderMetrics(metrics) {
    const metricsConfig = {
      'steps-card': {
        icon: '👣',
        title: 'Pasos Hoy',
        value: metrics.steps?.today || 0,
        target: metrics.steps?.target || 10000,
        trend: metrics.steps?.trend || 'neutral',
        type: 'steps'
      },
      'calories-card': {
        icon: '🔥',
        title: 'Calorías',
        value: metrics.calories?.burned || 0,
        trend: metrics.calories?.trend || 'neutral',
        type: 'calories'
      }
      // ... más métricas
    };

    Object.entries(metricsConfig).forEach(([cardId, config]) => {
      const cardElement = document.getElementById(cardId);
      if (cardElement) {
        cardElement.innerHTML = this.createMetricCard(config);
      }
    });
  }

  static createMetricCard(config) {
    return `
      <div class="summary-card metric-${config.trend}">
        <div class="card-header">
          <div class="card-icon">${config.icon}</div>
          <h3 class="card-title">${config.title}</h3>
        </div>
        <div class="card-content">
          <div class="card-value">${this.formatValue(config.value, config.type)}</div>
          ${config.target ? `
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(config.value / config.target) * 100}%"></div>
            </div>
            <div class="card-target">Meta: ${this.formatValue(config.target, config.type)}</div>
          ` : ''}
        </div>
      </div>
    `;
  }

  static formatValue(value, type) {
    if (type === 'steps') {
      return new Intl.NumberFormat('es-ES').format(value);
    }
    return value;
  }

  static renderRecentActivities(activities) {
    const listElement = document.getElementById('recent-activities-list');
    if (listElement && activities && activities.length > 0) {
      const activityItems = activities.map(activity => `
        <div class="activity-item">
          <span class="activity-icon">${activity.icon}</span>
          <p class="activity-description">${activity.description}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      `).join('');
      listElement.innerHTML = `<div class="activity-list">${activityItems}</div>`;
    } else if (listElement) {
      listElement.innerHTML = '<p>No recent activity.</p>';
    }
  }

  static initCharts() {
    const ctx = document.getElementById('activityChart');
    if (ctx) {
      // Inicializar gráfico con Chart.js
      new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Pasos',
            data: [6500, 7200, 8100, 7800, 9200, 8500, 7600],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  static setupEventListeners() {
    // Event listeners específicos del dashboard
  }
}

export default DashboardPage;