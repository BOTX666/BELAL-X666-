const { loadAppState, listenMqtt } = require('./fbClient');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const BOTNAME = config.BOTNAME || "Belal Chat Bot";
const PREFIX = config.PREFIX || "!";
const OWNER = config.Author || "MZ";
const ENABLED = config.Modules || {};
const SYSTEM = config.System || {};

console.clear();
console.log(chalk.red.bold(`
█████ █████ █████ █████
█   █ █   █ █   █ █   █
█████ █████ █████ █████
█ █   █ █   █ █   █ █
█████ █████ █████ █████
█ ███ █ ███ █ ███ █ ███
`));
console.log(chalk.cyan.bold(`•═ ${BOTNAME} ═•`));
console.log(chalk.yellow.bold(`OWNER: ${OWNER}`));
console.log(chalk.green.bold(`PREFIX: ${PREFIX}`));
console.log(chalk.white.bold(`LOADING MODULES...\n`));

// Load Commands with Toggle
const commands = {};
const commandPath = path.join(__dirname, 'commands');
fs.readdirSync(commandPath).forEach(file => {
  if (!file.endsWith('.js')) return;
  const name = file.replace('.js', '');
  if (ENABLED[name] === false) {
    console.log(chalk.gray(`⏸ Module ${name} is disabled in config`));
    return;
  }
  try {
    commands[name] = require(`./commands/${file}`);
    console.log(chalk.green(`✓ Module ${name} loaded successfully`));
  } catch (err) {
    console.log(chalk.red(`✗ Failed to load module ${name}: ${err.message}`));
    if (SYSTEM.errorLog) fs.appendFileSync('error.log', `[${name}] ${err.message}\n`);
  }
});

console.log(chalk.magenta(`∞∞ ${BOTNAME} LOADED ∞∞ All dependencies loaded\n`));

// Start Bot
loadAppState().then(api => {
  console.log(chalk.cyan.bold(`✅ ${BOTNAME} is now active`));
  api.setOptions({ listenEvents: true });

  listenMqtt(api, async event => {
    try {
      const msg = event.body?.trim();
      const sender = event.senderID;
      if (!msg || !sender) return;

      // Help
      if (msg === `${PREFIX}help` && commands.help) {
        api.sendMessage(commands.help(), sender);
        return;
      }

      // Ping
      if (msg === `${PREFIX}ping`) {
        api.sendMessage(`🏓 ${BOTNAME} is alive!`, sender);
        return;
      }

      // Roast
      if (msg.startsWith(`${PREFIX}roast`) && commands.roast) {
        api.sendMessage(await commands.roast(), sender);
        return;
      }

      // Inbox
      if (msg.startsWith(`${PREFIX}inbox`) && commands.inbox) {
        api.sendMessage(await commands.inbox(msg), sender);
        return;
      }

      // ChatGPT
      if (msg.startsWith(`${PREFIX}chatgpt`) && commands.chatgpt) {
        const prompt = msg.slice(`${PREFIX}chatgpt `.length);
        api.sendMessage(await commands.chatgpt(prompt), sender);
        return;
      }

      // Gemini
      if (msg.startsWith(`${PREFIX}gemini`) && commands.gemini) {
        const prompt = msg.slice(`${PREFIX}gemini `.length);
        api.sendMessage(await commands.gemini(prompt), sender);
        return;
      }

      // QueenChat
      if (msg.startsWith(`${PREFIX}queen`) && commands.queenchat) {
        const prompt = msg.slice(`${PREFIX}queen `.length);
        api.sendMessage(await commands.queenchat(prompt), sender);
        return;
      }

    } catch (err) {
      console.log(chalk.red(`⚠️ Runtime error: ${err.message}`));
      if (SYSTEM.errorLog) fs.appendFileSync('error.log', `[runtime] ${err.message}\n`);
    }
  });

  // Auto-Restart Logic
  if (SYSTEM.autoRestart && SYSTEM.restartInterval) {
    setTimeout(() => {
      console.log(chalk.yellow(`🔁 ${BOTNAME} restarting after ${SYSTEM.restartInterval} seconds...`));
      process.exit(1);
    }, SYSTEM.restartInterval * 1000);
  }

}).catch(err => {
  console.log(chalk.red.bold(`❌ ${BOTNAME} failed to start: ${err.message}`));
  if (SYSTEM.errorLog) fs.appendFileSync('error.log', `[startup] ${err.message}\n`);
});
