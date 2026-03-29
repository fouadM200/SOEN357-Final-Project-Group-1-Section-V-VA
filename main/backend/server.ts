import express from "express";
import cors from "cors";
import "dotenv/config";
import mockCoachReplyRoute from "./routes/mockCoachReply";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", mockCoachReplyRoute);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});