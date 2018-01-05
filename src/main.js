'use strict';

var keyword = process.argv[2];
var https = require('https');
const queryCode = require('./lib/queryCode');
const queryStockInfoByCode = require('./lib/queryStockInfoByCode');
const Utils = require('./lib/utils');

function showResultItems(items) {
  const resultItems = items.map(item => {
    return {
      title: item._result || item.name,
    };
  });
  Utils.showItems(resultItems);
}

queryCode(keyword).then(items => {
  const allPromise = items.map((item, index) => {
    const code = item.code;
    return queryStockInfoByCode(code).then(str => {
      item._result = str.trim();
    });
  });
  Promise.all(allPromise).then(() => {
    showResultItems(items);
  });
});
