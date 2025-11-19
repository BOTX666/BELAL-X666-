const PREFIX = process.env.BOT_PREFIX || "!";

module.exports = {
  getPrefix: () => PREFIX,
  isCommand: (msg, command) => msg.startsWith(PREFIX + command),
};
