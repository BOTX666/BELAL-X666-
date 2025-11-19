const login = require('facebook-chat-api');
const fs = require('fs');

const appState = JSON.parse(fs.readFileSync('./fbstate.json', 'utf8'));

module.exports = function(callback) {
  login({ appState }, (err, api) => {
    if (err) return console.error('Login failed:', err);
    callback(api);
  });
};
