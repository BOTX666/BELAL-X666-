const axios = require('axios');

module.exports = async function(prompt) {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: { Authorization: `Bearer ${process.env.CHATGPT_API_KEY}` }
      }
    );
    return res.data.choices[0].message.content;
  } catch (err) {
    return "⚠️ ChatGPT থেকে উত্তর আনা যায়নি।";
  }
};
