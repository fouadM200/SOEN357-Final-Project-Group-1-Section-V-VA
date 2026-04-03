import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

router.post("/mock-coach-reply", async (req, res) => {
    console.log("mock-coach-reply route hit");
    console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
    console.log("Incoming body:", req.body);

    try {
        const { coachName, coachSpecialty, messages } = req.body;

        if (
            !coachName ||
            typeof coachName !== "string" ||
            !Array.isArray(messages) ||
            messages.length === 0
        ) {
            return res.status(400).json({
                error: "Missing or invalid required fields.",
            });
        }

        const cleanedMessages = messages
            .filter(
                (msg: any) =>
                    msg &&
                    typeof msg.sender === "string" &&
                    typeof msg.text === "string" &&
                    msg.text.trim() !== ""
            )
            .slice(-8);

        if (cleanedMessages.length === 0) {
            return res.status(400).json({
                error: "No valid messages provided.",
            });
        }

        const conversationText = cleanedMessages
            .map((msg: { sender: string; text: string }) => {
                const role = msg.sender === "user" ? "User" : coachName;
                return `${role}: ${msg.text.trim()}`;
            })
            .join("\n");

        const specialtyText =
            typeof coachSpecialty === "string" && coachSpecialty.trim() !== ""
                ? `Your specialty is ${coachSpecialty.trim()}. `
                : "";

        const prompt =
            `You are ${coachName}, a professional online fitness coach inside the FitFuel app. ` +
            specialtyText +
            `Reply like a real coach texting a client. ` +
            `Be natural, supportive, practical, and concise. ` +
            `Keep replies under 70 words. ` +
            `Do not mention AI, automation, or language models. ` +
            `Do not sound robotic or overly formal. ` +
            `Do not give medical diagnoses. ` +
            `Do not encourage extreme dieting or unsafe workouts. ` +
            `Focus on fitness, nutrition, consistency, motivation, hydration, sleep, and recovery when relevant.\n\n` +
            `Here is the recent conversation:\n\n${conversationText}\n\n` +
            `Write the next short reply from ${coachName}.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        console.log("Gemini response received");

        const reply =
            response.text?.trim() ||
            "Nice work — stay consistent and let’s keep building from here.";

        return res.json({ reply });
    } catch (error: any) {
        console.error("mock-coach-reply full error:", error);
        console.error("mock-coach-reply message:", error?.message || error);

        return res.status(500).json({
            reply: "Sorry, I could not reply right now.",
        });
    }
});

export default router;