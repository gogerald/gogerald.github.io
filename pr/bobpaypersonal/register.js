function install() {
  navigator.serviceWorker.register('bobpay.js').then(function(registration) {
    if(!registration.paymentManager) {
      return;
    }

    registration.paymentManager.userHint = 'gogerald@google.com';
    addInstruments(registration);
    finishInstallation(true);
  }).catch(function(error) {
    alert("error: " + error);
    finishInstallation(false);
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
    registration.paymentManager.instruments.set(
      '12345',
      {
        name: "Visa ****1111",
        icons: [{
          src: "images/visa.png",
          sizes: '32x32',
          type: 'image/png'
        }],
        enabledMethods: ["basic-card"],
        capabilities: {
          supportedNetworks: ["visa"],
          supportedTypes: ["credit"]
        }
      }),
    ];

    return Promise.all(instrumentPromises);
  };

  function finishInstallation(succeed) {
    var para = document.createElement("p");
    var node = document.createTextNode("The service worker has been successfully installed.");
    node.id = "success";
    if(!succeed) {
      node = document.createTextNode("Failed to install the service worker.");
      node.id = "fail";
    }
    para.appendChild(node);

    var element = document.getElementById("installation_result");
    element.appendChild(para);

    if(succeed) {
      window.location.href = "#success";
    } else {
      window.location.href = "#fail";
    }
  }
