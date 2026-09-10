import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: '4.4.18' } });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 300000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API Endpoint Tests', () => {
  test('register with duplicate email fails', async () => {
    const userData = {
      name: 'Test User',
      email: 'duplicate@example.com',
      password: 'password123'
    };

    const firstRes = await request(app)
      .post('/api/auth/register')
      .send(userData);
    expect(firstRes.status).toBe(201);
    expect(firstRes.body).toHaveProperty('token');

    const duplicateRes = await request(app)
      .post('/api/auth/register')
      .send(userData);
    expect(duplicateRes.status).toBe(400);
    expect(duplicateRes.body.message).toMatch(/already exists/i);
  });

  test('login with wrong password fails', async () => {
    const userData = {
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123'
    };

    await request(app).post('/api/auth/register').send(userData);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword'
      });

    expect(loginRes.status).toBe(401);
    expect(loginRes.body.message).toMatch(/invalid email or password/i);
  });

  test('login with correct credentials returns a token', async () => {
    const userData = {
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123'
    };

    await request(app).post('/api/auth/register').send(userData);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(typeof loginRes.body.token).toBe('string');
  });
});
