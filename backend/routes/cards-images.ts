import OpenAi from "openai";
import sharp from 'sharp';
import { writeFileSync } from "node:fs"
import { Router } from "express";
import pool from '../db/pool.js'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !supabaseKey)
  throw new Error('Missing supabase variables')
const supabase = createClient(supabaseUrl, supabaseKey);

type StoredGeneratedCard = {
  name: string,
  imagePrompt: string
}

export const imageGenerateRouter = Router();

const client = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000,
});

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
        const completedCards = [];
        const prompts = cards.map((card) => client.images.generate({
          model: "gpt-image-1-mini",
          prompt: card.imagePrompt,
          size: "1024x1024",
          quality: "low",
          n: 1
        }));

        const imageResults = await Promise.all(prompts);

        for (const[i, imageResult] of imageResults.entries()){
          const b64 = imageResult.data?.[0]?.b64_json;
          if (!b64) throw new Error('no image generated');

          const generatedImg = Buffer.from(b64, "base64");

          const imgWebp = await sharp(generatedImg).resize(512, 512).webp({quality: 80}).toBuffer();
          await supabase.storage.from('generate-cards').upload(`${theme.replace(/\s+/g, '-')}${i}.webp`, imgWebp, { contentType: 'image/webp'});
          const { data } = supabase.storage.from('generate-cards').getPublicUrl(`${theme.replace(/\s+/g, '-')}${i}.webp`);
          completedCards.push({...cards[i], imageUrl: data.publicUrl})
          if (!data) 
            throw new Error('No generated card')
        };
        await pool.query(`UPDATE generated_cards SET cards = $1 WHERE theme = $2`, [JSON.stringify(completedCards), theme])
        res.json({cards: completedCards})
      }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate images'});
  }
})