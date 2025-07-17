import { describe, it, expect} from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Import your server setup
import app from './server';

describe('Server API Tests', () => {
  it('GET /api/data returns correct response', async () => {
    const response = await request(app)
      .get('/api/data')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Hello from server!',
      data: [1, 2, 3]
    });
  });

  it('handles CORS correctly', async () => {
    const response = await request(app)
      .get('/api/data')
      .set('Origin', 'http://localhost:5173')
      .expect('Access-Control-Allow-Origin', '*');
  });

  it('returns 404 for non-existent endpoints', async () => {
    await request(app)
      .get('/api/nonexistent')
      .expect(404);
  });
}); 