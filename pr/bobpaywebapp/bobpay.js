console.log("Running bobpay service worker");
self.addEventListener('paymentrequest', function(e) {
  e.respondWith(new Promise(function(resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(e) {
      self.removeEventListener('message', listener);
      if (e.data.hasOwnProperty('reason')) {
        reject(e.data);
      } else {
        resolve(e.data);
      }
    };

    e.openWindow("https://gogerald.github.io/pr/bobpaywebapp/pay")
    .then(function(windowClient) {
      windowClient.postMessage(e.data, [messageChannel.port2]);
    })
    .catch(function(err) {
      reject(err);
    });
  }));
});
