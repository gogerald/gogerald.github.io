console.log("Running bobpay service worker");
self.addEventListener('paymentrequest', function(e) {
  let p = new Promise(function(resolve, reject) {
    let payment_app_window = undefined;
    let window_ready = false;
    let payment_request_event = e.data;
    
    let maybeSendPaymentRequest = function() {
      if (payment_app_window && window_ready)
        payment_app_window.postMessage(payment_request_event);
    };

    self.addEventListener('message', listener = function(e) {
      if (e.data == "payment_app_window_ready") {
        window_ready = true;
        maybeSendPaymentRequest();
        return;
      }

      self.removeEventListener('message', listener);
      if(e.data.methodName) {
        resolve(e.data);
      } else {
        reject(e.data);
      }
    });

    e.openWindow("https://gogerald.github.io/pr/bobpaywebapp/pay")
    .then(window_client => {
      payment_app_window = window_client;
      maybeSendPaymentRequest();
    })
    .catch(function(err) {
      reject(err);
    });
  });

  e.respondWith(p);
});
