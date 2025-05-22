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

    console.log({from, to, message, channel})
  }
  
  static async sendToClient(notification: Notification) {
    // send notification to client
    const { from, to, message, channel } = notification;

    console.log({from, to, message, channel})
  }
  
  static async alertAdmin(notification: Notification) {
    // alert admin that something happened
    const { from, message } = notification;

    console.log({from, message})
  }
}

export default NotifyService
