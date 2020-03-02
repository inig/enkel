const request = require('request')
const fs = require('fs')

export function downloadFile (configuration) {
  return new Promise(function (resolve, reject) {
    // Save variable to know progress
    var received_bytes = 0;
    var total_bytes = 0;

    var req = request({
      method: 'GET',
      uri: configuration.url
    });

    var out = fs.createWriteStream(configuration.saveTo);
    req.pipe(out);

    req.on('response', function (data) {
      // Change the total bytes value to get progress later.
      total_bytes = parseInt(data.headers['content-length']);
    });

    // Get progress if callback exists
    if (configuration.hasOwnProperty("onProgress")) {
      req.on('data', function (chunk) {
        // Update the received bytes
        received_bytes += chunk.length;

        configuration.onProgress(received_bytes, total_bytes);
      });
    } else {
      req.on('data', function (chunk) {
        // Update the received bytes
        received_bytes += chunk.length;
      });
    }

    req.on('end', function () {
      resolve();
    });
  });
}
