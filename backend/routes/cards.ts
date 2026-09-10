import { Router } from "express";
import { z } from 'zod';
import { writeFileSync } from 'node:fs';
import OpenAi from 'openai';
import sharp from 'sharp';
import pool from "../db/pool.js";

export const cardsGenerateRouter = Router();

const CardSetSchema = z.object({
  cards: z.array (
    z.object ({
      name: z.string(),
      imagePrompt: z.string()
    })
  )
})

const ThemeRequestSchema = z.object({
  theme: z.string().min(2).max(50).toLowerCase()
})

const client = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000,
});

cardsGenerateRouter.post('/', async (req, res) => {

  try {
    const { theme } = ThemeRequestSchema.parse(req.body);

    const cachedCards = await pool.query("SELECT cards FROM generated_cards WHERE theme = $1", [theme]);

    if(cachedCards.rows.length > 0) {
      return res.json({ cards: cachedCards.rows[0].cards })
    }

    const response = await client.responses.create ({
      model: "gpt-5-nano",
      instructions: 'You generate requested amount of cards for requested theme for the game of cards, the cards should have flat vector illustation, keep the background plain and theme subject centered with no text, cards must be visually distinct from each other. Always return JSON objects only, each one has "name", that responds to the generated card and "imagePrompt", that describes the name created before and what exactly this name displays. Each card should have a front face different from others. Return JSON only, no markdown.',
      input: `Generate 15 cards for game with theme "${theme}"`,
      text: {
        format: {
          type: "json_schema",
          name: "card-set",
          strict: true,
          schema: {
            type: "object",
            properties: {
              cards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {type: "string"},
                    imagePrompt: {type: "string"}
                  },
                  required: ["name", "imagePrompt"],
                  additionalProperties: false
                },
                minItems: 15,
                maxItems: 15
              }
            },
            required: ["cards"],
            additionalProperties: false
          }
        }
      },
      reasoning: { effort: "low" }
    })

    const raw = response.output_text;
    const parsed = CardSetSchema.parse(JSON.parse(raw));

    await pool.query("INSERT INTO generated_cards (theme, cards) VALUES ($1, $2) ON CONFLICT (theme) DO NOTHING", [theme, JSON.stringify(parsed.cards)]);

    res.json(parsed);
  } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid theme"});
      }
      console.error(err);
      res.status(500).json({ error: 'Failed to generate cards'});
    }

  // const prompts = parsed.cards.map((card) => client.images.generate({
  //   model: "gpt-image-1-mini",
  //   prompt: card.imagePrompt,
  //   size: "1024x1024",
  //   quality: "low",
  //   n: 1
  // }));

  // const imageResults = await Promise.all(prompts);

  // for (const[i, res] of imageResults.entries()){
  //     const b64 = res.data?.[0]?.b64_json;
  //     if (!b64) throw new Error('no image generated');

  //     const generatedImg = Buffer.from(b64, "base64");

  //     const imgWebp = await sharp(generatedImg).resize(512, 512).webp({quality: 80}).toBuffer();
  //     writeFileSync(`card-${i}.webp`, imgWebp);
  // };
})
