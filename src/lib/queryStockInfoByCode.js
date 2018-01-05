'use strict';
const Utils = require('./utils');
const fs = require('fs');
const REG = /<meta\s+name="description" content="((?:\S+\s){3})/;
// TODO cache
module.exports = function queryStockInfoByCode(code) {
  return Utils.get({
    host: 'xueqiu.com',
    path: `/S/${code}`,
  }).then(res => {
    const match = REG.exec(res.body);
    if (match) {
      return match[1];
    }
  });
};
