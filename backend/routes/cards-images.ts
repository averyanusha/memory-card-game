import OpenAi from "openai";
import { Router } from "express";
import pool from '../db/pool.js';
import { imageQueue } from "../queues/queue.js";

type StoredGeneratedCard = {
  name: string,
  imagePrompt: string,
  imageUrl?: string
}

export const imageGenerateRouter = Router();


imageGenerateRouter.post('/', async (req, res) => {
  const { theme } = req.body;
  try {
    const result = await pool.query(`SELECT cards FROM generated_cards WHERE theme = $1`, [theme]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Theme not found'})
    }
    const cards: StoredGeneratedCard[] = result.rows[0].cards;
    if (cards[0] && 'imageUrl' in cards[0]) {
      return res.json({cards});
    } else {
        const job = await imageQueue.add('generate-images', { theme });
        console.log("created job:", job.id);
        return res.json({ jobId: job.id })
      }
  } catch (err) {
    if (err instanceof OpenAi.APIError) {
      if(err.status === 429) {
        return res.status(429).json({ code: 'RATE_LIMITED'});
      }
      if (err.status === 400) {
        return res.status(400).json({ code: 'THEME_REJECTED' });
      }
    };
    console.error(err);
    res.status(500).json({ code: 'GENERATION_FAILED'});
  }
})