import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import Component from '../models/Component.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let userToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Component.deleteMany({});

  const user = await User.create({
    email: `user${Date.now()}@test.com`,
    password: 'test123',
    isAdmin: false,
  });

  userToken = jwt.sign({ id: user._id, isAdmin: false }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await User.deleteMany();
  await Component.deleteMany();
  await mongoose.connection.close();
});

describe('Sécurité - Accès sans token', () => {
  it('refuse la création d’un composant sans token', async () => {
    const res = await request(app)
      .post('/api/components')
      .send({ name: 'GTX 1080', type: 'GPU', price: 300 });

    expect(res.statusCode).toBe(401);
  });

  it('refuse la suppression d’un composant sans token', async () => {
    const component = await Component.create({ name: 'GTX 1080', type: 'GPU', price: 300 });

    const res = await request(app)
      .delete(`/api/components/${component._id}`);

    expect(res.statusCode).toBe(401);
  });
});

describe('Sécurité - Accès avec token invalide ou non-admin', () => {
  it('refuse la création avec un token invalide', async () => {
    const res = await request(app)
      .post('/api/components')
      .set('Authorization', 'Bearer faketoken.123.invalid')
      .send({ name: 'GTX 1080', type: 'GPU', price: 300 });

    expect(res.statusCode).toBe(403);
  });

  it('refuse la création avec un token d’utilisateur non-admin', async () => {
    const res = await request(app)
      .post('/api/components')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'GTX 1080', type: 'GPU', price: 300 });

    expect(res.statusCode).toBe(403);
  });
});
