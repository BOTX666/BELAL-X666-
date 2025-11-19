const { loadAppState, listenMqtt } = require('./includes/listen');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { logError, cleanErrorLog } = require('./utils/logger');

const BOTNAME = config.BOTNAME || 'Belal Chat Bot';
const PREFIX = config.PREFIX || '!';
const OWNER = config.Author || 'MZ';
const ENABLED = config.Modules || {};
const SYSTEM = config.System || {};

if (SYSTEM.errorLog) cleanErrorLog();

console.clear();
console.log(chalk.cyan.bold(`•═ ${BOTNAME} ═•`));
console.log(chalk.yellow.bold(`OWNER: ${OWNER}`));
console.log(chalk.green.bold(`PREFIX: ${PREFIX}`));

const commands = {};
const commandsDir = path.join(__dirname, 'Script');
if (fs.existsSync(commandsDir)) {
  fs.readdirSync(commandsDir).forEach(file => {
    if (!file.endsWith('.js')) return;
    const name = file.replace('.js', '');
    if (ENABLED[name] === false) {
      console.log(chalk.gray(`⏸ Module ${name} disabled`));
      return;
    }
    try {
      commands[name] = require(path.join(commandsDir, file));
      console.log(chalk.green(`✓ Module ${name} loaded`));
    } catch (err) {
      console.log(chalk.red(`✗ Error loading ${name}: ${err.message}`));
      if (SYSTEM.errorLog) logError('module:' + name, err.message);
    }
  });
}

loadAppState().then(api => {
  console.log(chalk.cyan.bold(`✅ ${BOTNAME} is now active`));
  listenMqtt(api, async (event) => {
    try {
      const msg = event.body?.trim();
      const threadID = event.threadID;
      if (!msg || !threadID) return;

      // Help
      if (msg === `${PREFIX}help` && commands.help) {
        api.sendMessage(await commands.help({ PREFIX, BOTNAME }), threadID);
      }

      // Ping
      else if (msg === `${PREFIX}ping`) {
        api.sendMessage(`🏓 ${BOTNAME} চলছে!`, threadID);
      }

      // Roast
      else if (msg.startsWith(`${PREFIX}roast`) && commands.roast) {
        api.sendMessage(await commands.roast(), threadID);
      }

      // Inbox
      else if (msg.startsWith(`${PREFIX}inbox`) && commands.inbox) {
        api.sendMessage(await commands.inbox(msg, api), threadID);
      }

      // ChatGPT
      else if (msg.startsWith(`${PREFIX}chatgpt`) && commands.chatgpt) {
        const prompt = msg.slice(`${PREFIX}chatgpt`.length).trim();
        api.sendMessage(await commands.chatgpt(prompt), threadID);
      }

      // Gemini
      else if (msg.startsWith(`${PREFIX}gemini`) && commands.gemini) {
        const prompt = msg.slice(`${PREFIX}gemini`.length).trim();
        api.sendMessage(await commands.gemini(prompt), threadID);
      }

      // QueenChat
      else if (msg.startsWith(`${PREFIX}queen`) && commands.queenchat) {
        const prompt = msg.slice(`${PREFIX}queen`.length).trim();
        api.sendMessage(await commands.queenchat(prompt), threadID);
      }

      // File API
      else if (msg.startsWith(`${PREFIX}fileapi`) && commands.fileapi) {
        api.sendMessage(await commands.fileapi(msg), threadID);
      }

    } catch (err) {
      console.log(chalk.red(`⚠️ Runtime error: ${err.message}`));
      if (SYSTEM.errorLog) logError('runtime', err.message);
    }
  });
}).catch(err => {
  console.log(chalk.red.bold(`❌ ${BOTNAME} failed: ${err.message}`));
  if (SYSTEM.errorLog) logError('startup', err.message);
});
