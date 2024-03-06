import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

import assistantRoutes from './routes/assistant.js';

const app = express();
dotenv.config();

app.use(express.json({ limit: "300mb", extended: true }));
app.use(express.urlencoded({ limit: "300mb", extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the assistant AI server.");
});

app.use('/assistant', assistantRoutes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
