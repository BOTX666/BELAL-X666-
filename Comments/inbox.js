// commands/inbox.js — BELAL X666 inbox command
module.exports = {
  name: "inbox",
  description: "Show inbox messages or simulate inbox view",
  execute: async ({ client, from, args, MESSAGES }) => {
    try {
      // যদি কোনো আর্গুমেন্ট না দেয়
      if (!args.length) {
        return client.sendText(from, "📥 Your inbox is empty (placeholder).");
      }

      // Example: !inbox list
      const action = args[0].toLowerCase();

      if (action === "list") {
        // Placeholder inbox messages
        const inboxMessages = [
          "Message 1: Welcome to BELAL X666!",
          "Message 2: Don't forget to try !help",
          "Message 3: New features coming soon..."
        ];
        const response = inboxMessages.join("\n");
        return client.sendText(from, response);
      }

      if (action === "clear") {
        return client.sendText(from, "🗑 Inbox cleared (placeholder).");
      }

      // Default fallback
      return client.sendText(from, MESSAGES.fallback || "Unknown inbox action.");
    } catch (err) {
      client.sendText(from, MESSAGES.error || "Inbox command failed.");
    }
  }
};
