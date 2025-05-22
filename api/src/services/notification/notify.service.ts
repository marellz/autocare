interface Notification {
  from: string;
  to: string;
  message: string;
  channel: "sms" | "whatsapp";
}

class NotifyService {
  static async sendToVendor(notification: Notification) {
    // send notification to vendor
    const { from, to, message, channel } = notification;
  }

  static async sendToClient(notification: Notification) {
    // send notification to client
    const { from, to, message, channel } = notification;
  }

  static async alertAdmin(notification: Notification) {
    const { from, message } = notification;
    // alert admin that something happened
  }
}
