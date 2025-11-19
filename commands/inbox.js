const help = require('./commands/help');
const { getPrefix, isCommand } = require('./utils/prefix');

...

if (isCommand(msg, "help")) {
  api.sendMessage(help(), sender);
}

if (isCommand(msg, "roast")) {
  api.sendMessage(commands.roast(), sender);
}

if (isCommand(msg, "inbox")) {
  api.sendMessage(commands.inbox(msg), sender);
}

if (isCommand(msg, "chatgpt")) {
  const prompt = msg.replace(getPrefix() + "chatgpt ", "");
  chatgpt(prompt).then(reply => api.sendMessage(reply, sender));
}

if (isCommand(msg, "gemini")) {
  const prompt = msg.replace(getPrefix() + "gemini ", "");
  gemini(prompt).then(reply => api.sendMessage(reply, sender));
}

if (isCommand(msg, "queen")) {
  const prompt = msg.replace(getPrefix() + "queen ", "");
  queenchat(prompt).then(reply => api.sendMessage(reply, sender));
}
