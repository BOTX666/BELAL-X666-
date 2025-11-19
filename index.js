// index.js — BELAL X666 entry with autoloader
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const config = require('./bot.config.json');
const { logInfo, logWarn } = require('./utils/logger');

logInfo(`BELAL X666 started | Prefix: ${config.prefix} | Language: ${config.language}`);

// Load language file
const langFile = path.join(__dirname, 'lang', `${config.language}.json`);
let MESSAGES = {};
try {
  MESSAGES = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
} catch {
  logWarn(`Language file not found, falling back to en.json`);
  MESSAGES = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', 'en.json'), 'utf-8'));
}

// Placeholder client
function initClient() {
  logInfo('Client initialized (placeholder)');
  return {
    onMessage: (handler) => logInfo('Message listener bound'),
    sendText: (to, text) => logInfo(`Send to ${to}: ${text}`)
  };
}
const client = initClient();

// 🔥 Commands autoloader
const commands = {};
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const cmd = require(path.join(commandsPath, file));
      if (cmd && cmd.name && typeof cmd.execute === 'function') {
        commands[cmd.name] = cmd;
        logInfo(`Loaded command: ${cmd.name} (${file})`);
      } else {
        logWarn(`Skipped invalid command file: ${file}`);
      }
    } catch (err) {
      logWarn(`Error loading command file ${file}: ${err.message}`);
    }
  }
} else {
  logWarn('No commands folder found, skipping autoload.');
}

// Base handlers
function handleFallback(to) {
  client.sendText(to, MESSAGES.fallback);
}
function handleHelp(to) {
  client.sendText(to, MESSAGES.help);
}

function handleIncoming({ from, text }) {
  if (!text.startsWith(config.prefix)) return handleFallback(from);
  const raw = text.slice(config.prefix.length).trim();
  const [cmdName, ...args] = raw.split(/\s+/);

  if (cmdName === 'help') return handleHelp(from);

  const cmd = commands[cmdName];
  if (cmd) {
    try {
      cmd.execute({ client, from, args, MESSAGES });
    } catch (err) {
      logWarn(`Error executing command ${cmdName}: ${err.message}`);
      client.sendText(from, MESSAGES.error || 'Something went wrong.');
    }
  } else {
    handleFallback(from);
  }
}

client.onMessage(handleIncoming);
