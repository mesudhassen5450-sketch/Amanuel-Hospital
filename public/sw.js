self.addEventListener('push', function(event) {
  if (event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
    const options = {
      body: data.body || 'You have a new update in Amanuel Hospital Portal.',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      data: { url: data.url || '/' },
      requireInteraction: true
    };
    event.waitUntil(
      self.registration.showNotification(data.title || 'Amanuel Hospital Alert', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
