import { Worker, Job } from 'bullmq';
import { connection } from './redis.js';
import OpenAi from 'openai';
import { supabase } from '../db/supabase.js';
import pool from '../db/pool.js';
import sharp from 'sharp';


const client = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000,
});


type StoredGeneratedCard = {
  name: string,
  imagePrompt: string
}

const worker = new Worker('images', async(job: Job) => {
  try {
  const { theme } = job.data;
  const result = await pool.query(`SELECT cards FROM generated_cards WHERE theme = $1`, [theme]);
  const completedCards = [];
  const cards: StoredGeneratedCard[] = result.rows[0].cards
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
    const slug = theme.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'theme';
    await supabase.storage.from('generate-cards').upload(`${slug}-${i}.webp`, imgWebp, { contentType: 'image/webp'});
    const { data } = supabase.storage.from('generate-cards').getPublicUrl(`${slug}-${i}.webp`);
    completedCards.push({...cards[i], imageUrl: data.publicUrl})
    if (!data) 
      throw new Error('No generated card')
  };
  await pool.query(`UPDATE generated_cards SET cards = $1 WHERE theme = $2`, [JSON.stringify(completedCards), theme]);
  console.log("WORKER finished job", job.id, completedCards.length, "cards");
  } catch (error) {
  console.log('Worker failed job', job.id, error);
  throw error;
  }
}, { connection, concurrency: 1});