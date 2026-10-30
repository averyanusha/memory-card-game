import { Router } from "express";
import { imageQueue } from "../queues/queue.js";
import { Job } from "bullmq";
import pool from "../db/pool.js";

export const jobRouter = Router();

jobRouter.get('/:id', async(req, res) => {
  const jobId = await Job.fromId(imageQueue, req.params.id);
  if (!jobId)
    return res.status(404).json({code: 'JOB_NOT_FOUND'});

  const state = await jobId.getState();

  if (state === 'completed') {
    const result = await pool.query(`SELECT cards FROM generated_cards WHERE theme = $1`, [jobId.data.theme]);
    return res.json({ status: 'completed', cards: result.rows[0].cards});
  };
  if (state === 'failed') {
    return res.json({ status: 'failed', code: 'GENERATION_FAILED'});
  };

  return res.json({ status: state })
})