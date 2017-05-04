// Let's get permission!
async function install() {
  const { paymentManager } = await navigator.serviceWorker.register('bobpay.js');
  if (!paymentManager) {
    return; // not supported, so bail out.
  }
  const state = await navigator.permissions.query({ name: "paymenthandler" })
  switch (state) {
    case "denied":
      return;
    case "prompt":
      const result = await paymentManager.register();
      if (result === "denied") {
        return;
      }
      break;
  }
  // Excellent, we got it! Let's now set up the user's cards.
  await methodRegistration(paymentManager);
}

function methodRegistration({ methods }) {
  // These would normally come out of a database
  const promisesToAdd = [
    methods.set("visa-4756", {
      name: "Visa ending ****4756",
      methods: ["basic-card"],
      icons: ["/images/visa.png"],
    }),
    methods.set("visa-6789", {
      name: "Visa ending ***6789",
      methods: ["basic-card"],
      icons: ["/images/visa.png"],
    }),
    methods.set("bobpay", {
      name: "My Bob Pay Account: john@example.com",
      methods: ["https://emerald-eon.appspot.com/bobpay"],
      image: "/images/bobpay.png",
      icons: ["/images/bobpay.png"],
    }),
  ];
  return Promise.all(promisesToAdd);
}
