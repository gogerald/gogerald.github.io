console.log("Running bobpay service worker");
let payment_app_window = undefined;
let window_ready = false;
let payment_request_event = undefined;
let payment_request_resolver = undefined;

self.addEventListener('paymentrequest', function(e) {
  payment_request_event = e.data;

  payment_request_resolver = new PromiseResolver();
  e.respondWith(payment_request_resolver.promise);

  e.openWindow("https://gogerald.github.io/pr/bobpaywebapp/pay")
  .then(window_client => {
    payment_app_window = window_client;
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
    if (payment_app_window && window_ready)
      payment_app_window.postMessage(payment_request_event);
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

