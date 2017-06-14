console.log("Running bobpay service worker");
let payment_app_window = undefined;
let window_ready = false;
let payment_request_event = undefined;
self.addEventListener('paymentrequest', function(e) {
  payment_request_event = e.data;

  let resolver = new PromiseResolver();
  e.respondWith(resolver.promise);
  payment_request_event.resolver = resolver;

  e.openWindow("https://gogerald.github.io/pr/bobpaywebapp/pay")
  .then(window_client => {
    payment_app_window = window_client;
    maybeSendPaymentRequest();
  })
  .catch(function(err) {
    resolver.reject(err);
  }
});

function maybeSendPaymentRequest() {
    if (payment_app_window && window_ready)
      payment_app_window.postMessage(payment_request_event);
};

self.addEventListener('message', listener = function(e) {
  if (e.data == "payment_app_window_ready") {
    window_ready = true;
    maybeSendPaymentRequest();
    return;
  }

  let resolver = e.data.resolver;
  delete e.data.resolver;
  if(e.data.methodName) {
    resolver.resolve(e.data);
  } else {
    resolver.reject(e.data);
  }

  payment_app_window = undefined;
  window_ready = false;
  payment_request_event = undefined;
});

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

