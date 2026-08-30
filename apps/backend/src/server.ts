import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import generateRouter from './routes/generate.route';

const app = express();
const PORT = process.env['PORT'] || 4000;

app.use(cors({ origin: process.env['WEB_ORIGIN'] || 'http://localhost:3000' }));
app.use(express.json());

/**
 * Raise the server-level response timeout well above the worst-case observed
 * generation time (~30–60 s for a full plan). Default Express/Node timeout
 * is 2 minutes for keep-alive but 0 (no timeout) for regular requests, so
 * this is set explicitly to give clear headroom without risk of premature
 * cutoff. Claude plan generation typically completes in under 30 s; 120 s
 * is a safe upper bound.
 */
const RESPONSE_TIMEOUT_MS = 120_000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1/generate', generateRouter);

const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

server.setTimeout(RESPONSE_TIMEOUT_MS);
