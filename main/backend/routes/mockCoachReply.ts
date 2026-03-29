import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/mock-coach-reply", async (req, res) => {
    try {
        const { coachName, coachSpecialty, messages } = req.body;

        if (!coachName || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const conversationText = messages
            .map((msg: { sender: string; text: string }) => {
                const role = msg.sender === "user" ? "User" : coachName;
                return `${role}: ${msg.text}`;
            })
            .join("\n");

        const response = await client.responses.create({
            model: "gpt-5.4",
            input: [
                {
                    role: "system",
                    content:
                        `You are ${coachName}, a professional fitness coach in the FitFuel app. ` +
                        `${coachSpecialty ? `Your specialty is ${coachSpecialty}. ` : ""}` +
                        `Reply like a real coach texting a client. ` +
                        `Be supportive, practical, and concise. ` +
                        `Keep replies under 70 words. ` +
                        `Do not mention AI, language models, or automation.`
                },
                {
                    role: "user",
                    content:
                        `Here is the recent conversation:\n\n${conversationText}\n\n` +
                        `Write the next reply from ${coachName}.`
                }
            ]
        });

        return res.json({
            reply: response.output_text || "Sounds good — let’s keep going step by step.",
        });
    } catch (error) {
        console.error("mock-coach-reply error:", error);
        return res.status(500).json({
            reply: "Sorry, I could not reply right now.",
        });
    }
});

export default router;