const aiService = require('../services/ai.services');

const getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).send("Code is required");
    }

    try {
        const result = await aiService.generateContent(code);
        res.send(result);
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).send("Error generating AI response");
    }
}

module.exports = {
    getReview
};