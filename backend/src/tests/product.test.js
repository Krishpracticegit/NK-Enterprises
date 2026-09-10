import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

let mongoServer;
let adminToken;
let customerToken;
let categoryId;

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
  await Product.deleteMany({});
  await Category.deleteMany({});

  const category = await Category.create({
    name: 'Nursery Essentials',
    slug: 'nursery-essentials',
    description: 'Baby room products'
  });
  categoryId = category._id;

  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin'
    });
  adminToken = adminRes.body.token;

  const customerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Customer User',
      email: 'customer@example.com',
      password: 'customerpassword123',
      role: 'customer'
    });
  customerToken = customerRes.body.token;
});

describe('Product API Endpoint Tests', () => {
  test('GET /api/products paginates correctly', async () => {
    // Create 15 products
    const productDocs = [];
    for (let i = 1; i <= 15; i++) {
      productDocs.push({
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `Description for product ${i}`,
        price: 10 + i,
        category: categoryId,
        stock: 20
      });
    }
    await Product.insertMany(productDocs);

    // Request page 1 with limit 10
    const resPage1 = await request(app)
      .get('/api/products?page=1&limit=10');

    expect(resPage1.status).toBe(200);
    expect(resPage1.body.page).toBe(1);
    expect(resPage1.body.totalPages).toBe(2);
    expect(resPage1.body.totalResults).toBe(15);
    expect(resPage1.body.products).toHaveLength(10);

    // Request page 2 with limit 10
    const resPage2 = await request(app)
      .get('/api/products?page=2&limit=10');

    expect(resPage2.status).toBe(200);
    expect(resPage2.body.page).toBe(2);
    expect(resPage2.body.products).toHaveLength(5);
  });

  test('POST /api/products fails without an admin token and succeeds with one', async () => {
    const productData = {
      name: 'Organic Cotton Blanket',
      description: 'Super soft organic blanket',
      price: 29.99,
      category: categoryId.toString(),
      stock: 50
    };

    // Fails without token
    const noTokenRes = await request(app)
      .post('/api/products')
      .send(productData);
    expect(noTokenRes.status).toBe(401);

    // Fails with regular customer token
    const customerRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(productData);
    expect(customerRes.status).toBe(403);

    // Succeeds with admin token
    const adminRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(productData);
    expect(adminRes.status).toBe(201);
    expect(adminRes.body).toHaveProperty('_id');
    expect(adminRes.body.name).toBe('Organic Cotton Blanket');
  });
});
