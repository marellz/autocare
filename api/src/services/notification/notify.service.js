class NotifyService {
  static async sendToVendor(notification) {
    // send notification to vendor
    const { from, to, message, channel } = notification;
  }

  static async sendToClient(notification) {
    // send notification to client
    const { from, to, message, channel } = notification;
  }

  static async alertAdmin(notification) {
    const { from, message } = notification;
    // alert admin that something happened
  }
}
