module.exports = {
  name: "animate",
  execute: ({ client, from, args, MESSAGES }) => {
    if (!args.length) {
      return client.sendText(from, MESSAGES?.animate_prompt || "Please provide an animation prompt.");
    }
    const prompt = args.join(" ");
    client.sendText(from, `🎬 Animation started with prompt: "${prompt}"`);
  }
};
