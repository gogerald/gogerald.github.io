function install() {
  navigator.serviceWorker.register('bobpay.js', {scope: 'https://emerald-eon.appspot.com/bobpay'}).then(function(registration) {
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
        icons: [{
          src:"images/nonexistfortext.png",
          sizes:"32x32",
          type:"image/png"
        },
          {
          src:"images/bobpay.png",
          sizes:"32x32",
          type:"image/png"}
        ],
        enabledMethods: ["https://emerald-eon.appspot.com/bobpay"]
      }),
    ];

    return Promise.all(instrumentPromises);
  };
