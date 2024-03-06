import express from "express";

import { dunity } from "../controllers/assistant.js"

const router = express.Router();

router.post('/dunity', dunity)

export default router