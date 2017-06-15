console.log("Running bobpay service worker");
let window_ready = false;
let payment_request_event = undefined;
let payment_request_resolver = undefined;

self.addEventListener('paymentrequest', function(e) {
  payment_request_event = e.data;

  payment_request_resolver = new PromiseResolver();
  e.respondWith(payment_request_resolver.promise);

  e.openWindow("https://gogerald.github.io/pr/bobpaywebapp/pay")
  .then(window_client => {
    maybeSendPaymentRequest();
  })
  .catch(function(err) {
    payment_request_resolver.reject(err);
  })
});

self.addEventListener('message', listener = function(e) {
  if (e.data == "payment_app_window_ready") {
    window_ready = true;
    maybeSendPaymentRequest();
    return;
  }

  if(e.data.methodName) {
    payment_request_resolver.resolve(e.data);
  } else {
    payment_request_resolver.reject(e.data);
  }
});

function maybeSendPaymentRequest() {
    if (window_ready) {
      // Note that we do not use the returned window_client through openWindow since
      // it might changed by refreshing the opened page.
      // Refer https://www.w3.org/TR/service-workers-1/#clients-getall
      let options = {
        includeUncontrolled: false,
        type: 'window'
      };
      clients.matchAll(options).then(function(clientList) {
        for(var i = 0; i < clientList.length; i++) {
          // We may do additional communications or checks to make sure we are using 
          // the right page.
          clientList[i].postMessage(payment_request_event);
        }
      });
    }
}

function PromiseResolver() {
  /** @private {function(T=): void} */
  this.resolve_;

  /** @private {function(*=): void} */
  this.reject_;

  /** @private {!Promise<T>} */
  this.promise_ = new Promise(function(resolve, reject) {
    this.resolve_ = resolve;
    this.reject_ = reject;
  }.bind(this));
}

PromiseResolver.prototype = {
  /** @return {!Promise<T>} */
  get promise() {
    return this.promise_;
  },

  /** @return {function(T=): void} */
  get resolve() {
    return this.resolve_;
  },

  /** @return {function(*=): void} */
  get reject() {
    return this.reject_;
  },
};

