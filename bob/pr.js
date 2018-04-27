/**
 * Initializes the payment request object.
 * @return {PaymentRequest} The payment request object.
 */
function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    return null;
  }

  const supportedInstruments = [{
    supportedMethods: [
      'https://emerald-eon.appspot.com/bobpay',
    ],
  }];

  const details = {
    total: {
      label: 'Donation',
      amount: {
        currency: 'USD',
        value: '55.00',
      },
    },
    modifiers: [{
      supportedMethods: ['https://emerald-eon.appspot.com/bobpay'],
      total: {
        label: 'Total',
        amount: {currency: 'USD', value: '4.00'},
      },
      additionalDisplayItems: [{
        label: 'BobPay discount',
        amount: {currency: 'USD', value: '-1.00'},
      }],
      data: {discountProgramParticipantId: '86328764873265'},
    }],
    displayItems: [{
      label: 'Original donation amount',
      amount: {
        currency: 'USD',
        value: '65.00',
      },
    }, {
      label: 'Friends and family discount',
      amount: {
        currency: 'USD',
        value: '-10.00',
      },
    }],
  };

  let request = null;

  try {
    request = new PaymentRequest(supportedInstruments, details);
    if (request.canMakePayment) {
      request.canMakePayment().then(function(result) {
        info(result ? 'Can make payment' : 'Cannot make payment');
      }).catch(function(err) {
        console.log(err);
      });
    }
  } catch (e) {
    console.log('Developer mistake: \'' + e.message + '\'');
  }

  return request;
}

let request = buildPaymentRequest();

/**
 * Handles the response from PaymentRequest.show().
 */
function handlePaymentResponse(response) {
  window.setTimeout(function() {
    response.complete('success')
      .then(function() {
        done('This is a demo website. No payment will be processed.', response);
      })
      .catch(function(err) {
        console.log(err);
        request = buildPaymentRequest();
      });
  }, 500);
}

// Handle the response from PaymentRequest.show() if the page has been unloaded
// while the user was performing the payment.
window.addEventListener('paymentresponse', handlePaymentResponse);

/**
 * Launches payment request for Bob Pay.
 */
function onBuyClicked() { // eslint-disable-line no-unused-vars
  if (!window.PaymentRequest || !request) {
    console.log('PaymentRequest API is not supported.');
    return;
  }

  try {
    request.show()
      .then(handlePaymentResponse)
      .catch(function(err) {
        error(err);
        request = buildPaymentRequest();
      });
  } catch (e) {
    console.log('Developer mistake: \'' + e.message + '\'');
    request = buildPaymentRequest();
  }
}

window.setTimeout(function() {
  try {
    request.abort()
    .then(function(result) {
      if(result) {
        console.log('Abort payment request succeed');
      } else {
        console.log('Abort payment request failed.');
      }
    }) 
  } catch (e) {
    console.log('Developer mistake: \'' + e.message + '\'');
  }
}, 15000);
