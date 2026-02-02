/* global done:false */
/* global error:false */
/* global PaymentRequest:false */

/**
 * Launches payment request for credit cards.
 */
async function onScanClicked() {  // eslint-disable-line no-unused-vars
  let port = document.getElementById("port").value;
  info(`Scanning port: ${port}`)

  if (!window.PaymentRequest) {
    error('PaymentRequest API is not supported.');
    return;
  }

  var spinner = document.createElement('i');
  spinner.classList = 'fa fa-refresh fa-spin';
  var button = document.getElementById('scanButton');
  button.appendChild(spinner);

  try {
    const request = new PaymentRequest(
      [{ supportedMethods: `http://localhost:${port}/manifest.json` }],
      {
        total: {
          label: "Total",
          amount: { currency: "USD", value: "1.00" }
        }
      }
    );
    const response = await request.show();
    error("Unexpected payment success: " + response);
    await response.complete("success");
  } catch (err) {
    console.log("Payment failed: " + err);
    let errMsg = err.message;
    if (errMsg.includes('ERR_CONNECTION_REFUSED')) {
      info(`Port ${port} result: ERR_CONNECTION_REFUSED`);
    } else {
      if (errMsg.indexOf('HTTP header') !== -1) {
        info(`Port ${port} result: ${errMsg}`);
      } else if (errMsg.indexOf('HTTP') !== -1) {
        info(`Port ${port} result: ${errMsg.slice(errMsg.indexOf('HTTP'))}`);
      } else if (errMsg.indexOf('ERR_') !== -1) {
        info(`Port ${port} result: ${errMsg.slice(errMsg.indexOf('ERR_'))}`);
      } else {
        info(`Port ${port} result: ${errMsg}`);
      }
    }

  } finally {
    button.removeChild(spinner);
  }
}
