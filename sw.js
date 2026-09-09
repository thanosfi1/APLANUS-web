self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'APLANUS', body: 'Νέα αστρονομική ειδοποίηση!' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'APLANUS', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
