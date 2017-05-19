console.log("Running bobpay service worker");
self.addEventListener('paymentrequest', function(e) {
  e.respondWith(new Promise(function(resolve, reject) {
    self.addEventListener('message', listener = function(e) {
      self.removeEventListener('message', listener);
      if (e.data.hasOwnProperty('name')) {
        reject(e.data);
      } else {
        resolve(e.data);
      }
    });

    e.openWindow("https://gogerald.github.io/pr/pay")
    .then(function(windowClient) {
      windowClient.postMessage(e.data);
    })
    .catch(function(err) {
      reject(err);
    });
  }));
});
