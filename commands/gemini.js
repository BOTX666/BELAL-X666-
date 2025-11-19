const axios = require('axios');

module.exports = async function(prompt) {
  try {
    const res = await axios.post(
      'https://gemini.googleapis.com/v1beta/chat:generate',
      { prompt },
      {
        headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` }
      }
    );
    return res.data.reply || "⚠️ Gemini থেকে উত্তর পাওয়া যায়নি।";
  } catch (err) {
    return "⚠️ Gemini API তে সমস্যা হয়েছে।";
  }
};
