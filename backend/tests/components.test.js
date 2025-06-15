import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import Component from '../models/Component.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let adminToken, userToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await Component.deleteMany();
  await User.deleteMany();

  const admin = await User.create({ email: 'admin@test.com', password: 'pass123', isAdmin: true });
  const user = await User.create({ email: 'user@test.com', password: 'pass123', isAdmin: false });

  adminToken = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET);
  userToken = jwt.sign({ id: user._id, isAdmin: false }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Component API', () => {
  it('récupère tous les composants (GET)', async () => {
    await Component.create({ name: 'GPU RTX', type: 'GPU', price: 299.99 });

    const res = await request(app).get('/api/components');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('crée un composant (POST, admin uniquement)', async () => {
    const res = await request(app)
      .post('/api/components')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'RAM 16GB', type: 'RAM', price: 79.99 });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('RAM 16GB');
  });

  it('refuse la création sans droit admin', async () => {
    const res = await request(app)
      .post('/api/components')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'SSD', category: 'Storage', price: 59.99, type: 'NVMe' });

    expect(res.statusCode).toBe(403);
  });

  it('met à jour un composant (PUT)', async () => {
    const component = await Component.create({ name: 'Old Name', type: 'GPU', price: 199.99 });

    const res = await request(app)
      .put(`/api/components/${component._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'New Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  it('supprime un composant (DELETE)', async () => {
    const component = await Component.create({ name: 'To Delete', type: 'GPU', price: 99.99 });

    const res = await request(app)
      .delete(`/api/components/${component._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    const stillThere = await Component.findById(component._id);
    expect(stillThere).toBeNull();
  });
});
