function install() {
  navigator.serviceWorker.register('bobpay.js').then(function(registration) {
    if(!registration.paymentManager) {
      return;
    }
    addInstruments(registration);
  }).catch(function(error) {
    alert("error: " + error);
  });
}

function addInstruments(registration) {
  const instrumentPromises = [
    registration.paymentManager.instruments.set(
      "c8126178-3bba-4d09-8f00-0771bcfd3b11",
      {
        name: "My Bob Pay Account: gogerald@google.com",
        enabledMethods: ["https://emerald-eon.appspot.com/bobpay"],
        icons: ["images/bobpay.png"]
      }),
    ];

    return Promise.all(instrumentPromises);
  };
