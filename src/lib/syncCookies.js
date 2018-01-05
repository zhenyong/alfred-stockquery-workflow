const Utils = require('./utils');
const fs = require('fs');

module.exports = function syncCookies() {
  return Utils.get({
    host: 'xueqiu.com',
  }).then(res => {
    cookies = res.headers['set-cookie'] || res.headers['Set-Cookie'] || [];
    const convertedCookies = cookies //
      .map(line => {
        const match = /(^[^=]+=[^;]+;)/.exec(line);
        return match ? match[0] : null;
      }) //
      .filter(v => !!v);
    fs.writeFileSync('./cookie.txt', convertedCookies.join(' '));
    return convertedCookies;
  });
};
