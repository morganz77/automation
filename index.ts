import * as child_process from 'child_process';
import express from 'express';

const app = express();

interface JobType {
  jobType: 'HN';
}

app.use(express.json());
app.get('/', (req, res) => {
  res.send('It works!');
});

app.post('/', (req, res) => {
  const { jobType }: JobType = req.body;
  try {
    switch (jobType) {
      case 'HN':
        child_process.execSync('./hn-run.sh');
        res.status(201).end();
        break;
      default:
        console.error('Unknown type requested');
        res.status(400).end();
    }
  } catch (e) {
    console.error(JSON.stringify(e));
    res.status(500).end();
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log('server started on port 8080');
});
