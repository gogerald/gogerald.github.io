self.addEventListener('install', function(e) {
  console.log('Install event:', e);
});

self.addEventListener('activate', function(e) {
  console.log('Activate event:', e);

clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow('https://gogerald.github.io/pr/bobpaywebapp');  
      }
    }
});