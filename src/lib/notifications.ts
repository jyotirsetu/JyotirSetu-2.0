export class NotificationService {
  private static instance: NotificationService;
  private lastCheck: { appointments: number; contacts: number } = { appointments: 0, contacts: 0 };
  private checkInterval: number | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  }

  showNotification(title: string, body: string, icon?: string) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
    if (settings.browserNotifications === false) {
      return;
    }

    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'admin-notification',
      requireInteraction: false
    });
  }

  async checkForUpdates() {
    try {
      const [apptsRes, contactsRes] = await Promise.all([
        fetch('/api/admin/appointments?page=1&limit=1').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/contacts?page=1&limit=1').then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      const apptsCount = apptsRes.pagination?.total || 0;
      const contactsCount = contactsRes.pagination?.total || 0;

      const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');

      if (this.lastCheck.appointments > 0 && apptsCount > this.lastCheck.appointments) {
        if (settings.notifyNewAppointment !== false) {
          this.showNotification(
            'New Appointment!',
            `You have ${apptsCount - this.lastCheck.appointments} new appointment(s)`,
            '/favicon.ico'
          );
        }
      }

      if (this.lastCheck.contacts > 0 && contactsCount > this.lastCheck.contacts) {
        if (settings.notifyNewContact !== false) {
          this.showNotification(
            'New Contact Message!',
            `You have ${contactsCount - this.lastCheck.contacts} new contact message(s)`,
            '/favicon.ico'
          );
        }
      }

      this.lastCheck = { appointments: apptsCount, contacts: contactsCount };
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  startPolling(intervalMs: number = 30000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    this.checkInterval = window.setInterval(() => {
      this.checkForUpdates();
    }, intervalMs);
  }

  stopPolling() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  async initialize() {
    await this.requestPermission();
    
    // Initial check
    await this.checkForUpdates();
    
    // Start polling
    this.startPolling(30000); // Check every 30 seconds
  }
}

export const notificationService = NotificationService.getInstance();


