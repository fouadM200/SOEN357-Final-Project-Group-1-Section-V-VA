import express from "express";

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";

router.post("/estimate-meal", async (req, res) => {
    try {
        console.log("POST /api/estimate-meal hit");
        console.log("Request body:", req.body);
        console.log("GEMINI KEY EXISTS:", !!GEMINI_API_KEY);

        const { mealName } = req.body ?? {};

        if (!mealName || typeof mealName !== "string" || !mealName.trim()) {
            return res.status(400).json({
                error: "mealName is required.",
            });
        }

        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is missing in backend .env",
            });
        }

        const cleanedMealName = mealName.trim();

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        'Estimate nutrition for one standard serving of this meal: "' +
                                        cleanedMealName +
                                        '". Return ONLY valid JSON with this exact shape: ' +
                                        '{"name":"string","calories":0,"protein":0,"fat":0,"carbs":0}. ' +
                                        "Use integers only. No markdown. No extra text."
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        console.log("Gemini raw response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to estimate meal nutrition.",
                details: data?.error?.message || "Unknown Gemini API error.",
            });
        }

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!text) {
            return res.status(500).json({
                error: "No text returned from Gemini.",
                raw: data,
            });
        }

        let parsed: {
            name: string;
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
        };

        try {
            parsed = JSON.parse(text);
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return res.status(500).json({
                error: "Could not parse Gemini response.",
                raw: text,
            });
        }

        if (
            typeof parsed.name !== "string" ||
            typeof parsed.calories !== "number" ||
            typeof parsed.protein !== "number" ||
            typeof parsed.fat !== "number" ||
            typeof parsed.carbs !== "number"
        ) {
            return res.status(500).json({
                error: "Gemini response has an invalid shape.",
                raw: parsed,
            });
        }

        return res.json({
            name: parsed.name,
            calories: Math.max(0, Math.round(parsed.calories)),
            protein: Math.max(0, Math.round(parsed.protein)),
            fat: Math.max(0, Math.round(parsed.fat)),
            carbs: Math.max(0, Math.round(parsed.carbs)),
        });
    } catch (error: any) {
        console.error("estimate-meal error:", error);

        return res.status(500).json({
            error: "Failed to estimate meal nutrition.",
            details: error?.message ?? "Unknown server error.",
        });
    }
});

router.get("/estimate-meal-test", (_req, res) => {
    return res.json({
        message: "estimate-meal route is reachable",
    });
});

export default router;