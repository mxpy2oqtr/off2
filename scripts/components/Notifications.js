class Notifications {
  constructor() {
    console.log('Notifications initialized');
  }

  static show(title, message, type) {
    console.log(`Notification: [${type}] ${title} - ${message}`);
  }
}

export default Notifications;
