require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env")
});
const { GoogleGenAI } = require("@google/genai");
const { CODE_REVIEW_INSTRUCTION } = require("../constants/instruction");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY
});

async function generateContent(prompt) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    input: prompt,
    system_instruction: CODE_REVIEW_INSTRUCTION
  });

  return interaction.output_text;
}

module.exports = { generateContent };
