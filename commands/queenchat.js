const axios = require('axios');

module.exports = async function(prompt) {
  try {
    const res = await axios.post(
      'https://api.queenchat.xyz/v1/chat',
      { prompt },
      {
        headers: { Authorization: `Bearer ${process.env.QUEENCHAT_API_KEY}` }
      }
    );
    return res.data.response || "⚠️ QueenChat থেকে উত্তর পাওয়া যায়নি।";
  } catch (err) {
    return "⚠️ QueenChat API তে সমস্যা হয়েছে।";
  }
};
