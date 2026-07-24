jest.mock('./jobs/hn', () => ({ runHnJob: jest.fn() }));

import request from 'supertest';
import { createApp } from './app';
import { runHnJob } from './jobs/hn';

const mockRunHnJob = runHnJob as jest.MockedFunction<typeof runHnJob>;
const app = createApp();

describe('app routes', () => {
  beforeEach(() => {
    mockRunHnJob.mockReset();
  });

  it('GET / responds with a health message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('It works!');
  });

  it('POST / with the HN job runs it and returns 201', async () => {
    mockRunHnJob.mockResolvedValue(undefined);

    const res = await request(app).post('/').send({ jobType: 'HN' });

    expect(res.status).toBe(201);
    expect(mockRunHnJob).toHaveBeenCalledTimes(1);
  });

  it('POST / with an unknown job type returns 400 without running a job', async () => {
    const res = await request(app).post('/').send({ jobType: 'NOPE' });

    expect(res.status).toBe(400);
    expect(mockRunHnJob).not.toHaveBeenCalled();
  });

  it('POST / returns 500 when the job throws', async () => {
    mockRunHnJob.mockRejectedValue(new Error('boom'));

    const res = await request(app).post('/').send({ jobType: 'HN' });

    expect(res.status).toBe(500);
  });
});
