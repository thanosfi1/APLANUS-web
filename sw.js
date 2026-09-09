self.addEventListener('push', function(event) {
  if (!event.data) return;
  const data = event.data.json();

self.addEventListener('push', event => {
  let data = { title: 'APLANUS', body: 'Νέα ειδοποίηση!' };
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

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
