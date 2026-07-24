import express from 'express';
import { runHnJob } from './jobs/hn';

const app = express();

interface JobRequest {
  jobType: 'HN';
}

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('It works!');
});

app.post('/', async (req, res) => {
  const { jobType }: JobRequest = req.body;
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

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
