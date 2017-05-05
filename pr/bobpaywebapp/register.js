async function install() {
  const { registration } =
    await navigator.serviceWorker.register('empty-payment-worker.js');
  if (!registration.paymentManager) {
    return; // not supported, so bail out.
  }
  const state =
    await navigator.permissions.query({ name: "paymenthandler" });

  switch (state) {
    case "denied":
      return;
    case "prompt":
      // Note -- it's not clear how this should work yet; see Issue 94.
      const result = await registration.paymentManager.requestPermission();
      if (result === "denied") {
        return;
      }
      break;
  }
  // Excellent, we got it! Let's now set up the user's cards.
  await addInstruments(registration);
}

function addInstruments(registration) {
  const instrumentPromises = [
    registration.paymentManager.instruments.set(
      "dc2de27a-ca5e-4fbd-883e-b6ded6c69d4f",
      {
        name: "Visa ending ****4756",
        enabledMethods: ["basic-card"],
        capabilities: {
          supportedNetworks: ['visa'],
          supportedTypes: ['credit']
        }
      }),

    registration.paymentManager.instruments.set(
      "c8126178-3bba-4d09-8f00-0771bcfd3b11",
      {
        name: "My Bob Pay Account: john@example.com",
        enabledMethods: ["https://emerald-eon.appspot.com/bobpay"],
        icons: ["images/bobpay.png"]
      }),

    registration.paymentManager.instruments.set(
      "new-card",
      {
        name: "Add new credit/debit card to ExampleApp",
        enabledMethods: ["basic-card"],
        capabilities: {
          supportedNetworks:
            ['visa','mastercard','amex','discover'],
          supportedTypes: ['credit','debit','prepaid']
        }
      }),
    ];

    return Promise.all(instrumentPromises).then(() => {
      registration.paymentManager.wallets.set(
        "12a1b7e5-16c0-4c09-a312-9b191d08517b",
        {
          name: "Acme Bank Personal Accounts",
          icons: [
                   { src: "images/visa.png",
                     sizes: "48x48"
                   }
                 ],
          instrumentKeys: [
              "dc2de27a-ca5e-4fbd-883e-b6ded6c69d4f",
              "c8126178-3bba-4d09-8f00-0771bcfd3b11",
              "new-card"
            ]
        });
     });
  };
