module.exports = {
  name: "roast",
  execute: ({ client, from }) => {
    const roasts = [
      "তুমি এত স্লো যে WiFi-ও বিরক্ত!",
      "তোমার জ্ঞান Google search এর প্রথম পেজের বাইরে যায় না!",
      "তুমি এত অলস যে ঘড়িও তোমাকে দেখে থেমে যায়!",
      "তুমি এত বোরিং যে Netflix তোমাকে ব্লক করে দেবে!",
      "তুমি এত কনফিউজড যে GPS-ও তোমাকে খুঁজে পায় না!"
    ];
    const msg = roasts[Math.floor(Math.random() * roasts.length)];
    client.sendText(from, msg);
  }
};
