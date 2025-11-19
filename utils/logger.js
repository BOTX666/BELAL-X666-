const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const LOG_FILE = path.join(LOG_DIR, `belal-${new Date().toISOString().slice(0,10)}.log`);

function stamp() { return new Date().toISOString(); }
function write(level, msg) {
  const line = `[${stamp()}] [${level}] ${msg}\n`;
  fs.appendFile(LOG_FILE, line, () => {});
  console.log(line.trim());
}

module.exports = {
  logInfo: (msg) => write('INFO', msg),
  logWarn: (msg) => write('WARN', msg),
  logError: (msg) => write('ERROR', msg)
};
