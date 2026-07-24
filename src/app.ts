import express, { Express } from 'express';
import { runHnJob } from './jobs/hn';

interface JobRequest {
  jobType: 'HN';
}

/**
 * Build the Express application. Kept separate from the server bootstrap so it
 * can be exercised in tests without binding a port.
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/', (_req, res) => {
    res.send('It works!');
  });

  app.post('/', async (req, res) => {
    const { jobType }: JobRequest = req.body ?? {};
    try {
      switch (jobType) {
        case 'HN':
          await runHnJob();
          res.status(201).end();
          break;
        default:
          console.error(`Unknown job type requested: ${jobType}`);
          res.status(400).end();
      }
    } catch (e) {
      console.error(e instanceof Error ? e.stack : JSON.stringify(e));
      res.status(500).end();
    }
  });

  return app;
}
