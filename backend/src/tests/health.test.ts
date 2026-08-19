import request from 'supertest';
import express from 'express';
import routes from '../routes';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Health Check API', () => {
  it('should return a 200 OK with success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Server is healthy');
  });

  it('should return 401 Unauthorized for protected routes without token', async () => {
    const res = await request(app).get('/api/orgs');
    expect(res.status).toBe(401);
  });
});
