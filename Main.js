// Main.js — Belal startup with styled ASCII banner and clean module logs
const { loadAppState, listenMqtt } = require('./fbClient');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const BOTNAME = (config.BOTNAME || 'Belal').toUpperCase();
const OWNER = config.Author || 'MZ';
const PREFIX = config.PREFIX || '!';

// Styled ASCII blocks (inspired by your screenshot)
const asciiBlock = `
█████ █████ █████ █████
█   █ █   █ █   █ █   █
█████ █████ █████ █████
█ █   █ █   █ █   █ █
█████ █████ █████ █████
█ ███ █ ███ █ ███ █ ███
`;

function banner() {
  console.clear();
  console.log(chalk.red.bold(asciiBlock));
  console.log(chalk.cyan.bold(`•═ ${BOTNAME} CHAT BOT ═•`));
  console.log(chalk.yellow.bold(`OWNER: ${OWNER}`));
  console.log(chalk.green.bold(`PREFIX: ${PREFIX}`));
  console.log(chalk.white.bold(`Loading modules...\n`));
}

// Module loader with duplicate-name protection
function loadModules(dir = path.join(__dirname, 'commands')) {
  const loaded = {};
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const name = file.replace('.js', '');
    if (loaded[name]) {
      console.log(chalk.red(`✗ Failed to load module ${name}. Error: Module name already exists in the system!`));
      continue;
    }
    try {
      loaded[name] = require(path.join(dir, file));
      console.log(chalk.green(`✓ Module ${name} loaded successfully`));
    } catch (err) {
      console.log(chalk.red(`✗ Failed to load module ${name}. Error: ${err.message}`));
    }
  }
  console.log(chalk.magenta(`∞∞ ${BOTNAME} LOADED ∞∞ All dependencies loaded successfully\n`));
  return loaded;
}

banner();
const commands = loadModules();

loadAppState().then(api => {
  console.log(chalk.cyan.bold(`✅ ${BOTNAME} is now active`));
  listenMqtt(api, async event => {
    const msg = event.body?.trim();
    const sender = event.senderID;
    if (!msg || !sender) return;

    // Help
    if (msg === `${PREFIX}help`) {
      const helpText =
        `🤖 ${BOTNAME} — Available Commands:\n` +
        `• ${PREFIX}help\n` +
        `• ${PREFIX}ping\n` +
        `• ${PREFIX}roast\n` +
        `• ${PREFIX}inbox list | ${PREFIX}inbox clear\n` +
        `• ${PREFIX}chatgpt <prompt>\n` +
        `• ${PREFIX}gemini <prompt>\n` +
        `• ${PREFIX}queen <prompt>`;
      api.sendMessage(helpText, sender);
      return;
    }

    // Ping
    if (msg === `${PREFIX}ping`) {
      api.sendMessage(`🏓 ${BOTNAME} is alive!`, sender);
      return;
    }

    // Command routing (only if corresponding files exist)
    if (msg.startsWith(`${PREFIX}roast`) && commands.roast) {
      api.sendMessage(await commands.roast(), sender);
      return;
    }

    if (msg.startsWith(`${PREFIX}inbox`) && commands.inbox) {
      api.sendMessage(await commands.inbox(msg), sender);
      return;
    }

    if (msg.startsWith(`${PREFIX}chatgpt`) && commands.chatgpt) {
      const prompt = msg.slice(`${PREFIX}chatgpt `.length);
      api.sendMessage(await commands.chatgpt(prompt), sender);
      return;
    }

    if (msg.startsWith(`${PREFIX}gemini`) && commands.gemini) {
      const prompt = msg.slice(`${PREFIX}gemini `.length);
      api.sendMessage(await commands.gemini(prompt), sender);
      return;
    }

    if (msg.startsWith(`${PREFIX}queen`) && commands.queenchat) {
      const prompt = msg.slice(`${PREFIX}queen `.length);
      api.sendMessage(await commands.queenchat(prompt), sender);
      return;
    }
  });
}).catch(err => {
  console.log(chalk.red.bold(`❌ ${BOTNAME} failed to start: ${err.message}`));
});
