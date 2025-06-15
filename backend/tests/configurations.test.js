import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Component from '../models/Component.js';
import SavedConfiguration from '../models/SavedConfiguration.js';
import jwt from 'jsonwebtoken';

let userToken, userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.create({ email: 'config@test.com', password: 'test123' });
  userId = user._id;
  userToken = jwt.sign({ id: user._id, isAdmin: false }, process.env.JWT_SECRET);
});

afterEach(async () => {
  await SavedConfiguration.deleteMany();
  await Component.deleteMany();
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
});

describe('SavedConfiguration API', () => {
  it('crée une configuration enregistrée (POST)', async () => {
    const component = await Component.create({ name: 'Intel i5', type: 'CPU', price: 200 });

    const res = await request(app)
      .post('/api/configurations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Ma config perso',
        components: [component._id]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Ma config perso');
    expect(res.body.components.length).toBe(1);
  });

  it('récupère toutes les configurations de l’utilisateur (GET)', async () => {
    const component = await Component.create({ name: 'GTX 1660', type: 'GPU', price: 300 });

    await SavedConfiguration.create({
      name: 'Config gamer',
      user: userId,
      components: [component._id]
    });

    const res = await request(app)
      .get('/api/configurations')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('met à jour une configuration (PUT)', async () => {
    const component = await Component.create({ name: 'Ryzen 5', type: 'CPU', price: 220 });

    const config = await SavedConfiguration.create({
      name: 'Config à modifier',
      user: userId,
      components: [component._id]
    });

    const res = await request(app)
      .put(`/api/configurations/${config._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Config modifiée' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Config modifiée');
  });

  it('supprime une configuration (DELETE)', async () => {
    const component = await Component.create({ name: 'RAM 8GB', type: 'RAM', price: 50 });

    const config = await SavedConfiguration.create({
      name: 'À supprimer',
      user: userId,
      components: [component._id]
    });

    const res = await request(app)
      .delete(`/api/configurations/${config._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);

    const stillExists = await SavedConfiguration.findById(config._id);
    expect(stillExists).toBeNull();
  });
});
