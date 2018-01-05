'use strict';
const Utils = require('./utils');
const syncCookies = require('./syncCookies');
const fs = require('fs');

function confirmSyncCookies() {
  return new Promise(resolve => {
    fs.stat('./cookie.txt', (error, stat) => {
      if (!stat) {
        return syncCookies();
      } else {
        resolve();
      }
    });
  });
}

const getCookies = () => {
  return new Promise(resolve => {
    confirmSyncCookies().then(() => {
      fs.readFile('./cookie.txt', (err, strCookie) => {
        resolve(strCookie);
      });
    });
  });
};
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// TODO cache
module.exports = function queryCode(kw, reTryInfo) {
  if (!reTryInfo) {
    reTryInfo = { count: 0 };
  } else {
    reTryInfo.count += 1;
  }

  return new Promise((resolve, reject) => {
    getCookies().then(strCookie => {
      const options = {
        host: 'xueqiu.com',
        path: `/stock/search.json?code=${kw}&size=6`,
        headers: {
          Cookie: strCookie,
        },
      };
      Utils.get(options).then(res => {
        if (/error_code.*400016/.test(res.body)) {
          if (reTryInfo.count <= 2) {
            return syncCookies().then(() => {
              return queryCode(kw, reTryInfo);
            });
          }
        } else {
          resolve(res.json.stocks ? clone(res.json.stocks) : []);
        }
      });
    });
  });
};
