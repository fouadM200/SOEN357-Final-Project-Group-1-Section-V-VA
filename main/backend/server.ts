import "dotenv/config";
import express from "express";
import cors from "cors";
import estimateMealRoute from "./routes/estimateMeal";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", estimateMealRoute);

app.get("/ping", (_req, res) => {
    res.json({ message: "pong" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});