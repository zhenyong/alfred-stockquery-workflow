'use strict';
const https = require('https');

function showItems(items) {
  console.log(JSON.stringify({ items: items }));
}

const get = options => {
  return new Promise((resolve, reject) => {
    let body = '';
    options = options || {};
    options.headers = options.headers || {};
    options.headers['User-Agent'] =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36';
    https.get(options, function(res) {
      res
        .on('data', chunk => {
          body += chunk;
        })
        .on('error', reject)
        .on('end', function() {
          res.body = body;
          try {
            res.json = JSON.parse(res.body);
          } catch (e) {
            res.json = {};
          }
          resolve(res);
        });
    });
  });
};

module.exports = {
  get: get,
  showItems: showItems,
};
