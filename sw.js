// APLANUS Service Worker

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Διαχείριση Push Ειδοποιήσεων
self.addEventListener('push', (event) => {
  let payload = {};

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = { body: event.data.text() };
    }
  }

  // Αυστηρός τίτλος μόνο APLANUS για αποφυγή διπλότυπων "from APLANUS"
  const title = 'APLANUS';
  
  const options = {
    body: payload.body || 'Νέα αστρονομική ενημέρωση διαθέσιμη!',
    tag: 'aplanus-notification',
    renotify: true,
    data: {
      url: self.registration.scope || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Άνοιγμα/Εστίαση στην εφαρμογή όταν πατηθεί το banner
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
