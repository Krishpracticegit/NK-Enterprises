import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';

let mongoServer;
let customerToken;
let productId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
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
  await Order.deleteMany({});

  const category = await Category.create({
    name: 'Baby Toys',
    slug: 'baby-toys',
    description: 'Safe toys for infants'
  });

  const product = await Product.create({
    name: 'Teething Rattle Set',
    slug: 'teething-rattle-set',
    description: 'BPA-free silicone teething set',
    price: 15.00,
    category: category._id,
    stock: 10
  });
  productId = product._id;

  const customerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Buyer User',
      email: 'buyer@example.com',
      password: 'buyerpassword123',
      role: 'customer'
    });
  customerToken = customerRes.body.token;
});

describe('Order API Endpoint Tests', () => {
  test('creating an order correctly decrements stock', async () => {
    // Initial product stock check
    const initialProduct = await Product.findById(productId);
    expect(initialProduct.stock).toBe(10);

    const orderPayload = {
      items: [
        {
          product: productId.toString(),
          name: 'Teething Rattle Set',
          quantity: 4,
          price: 15.00,
          image: '/images/rattle.jpg'
        }
      ],
      shippingAddress: {
        line1: '123 Baby St',
        city: 'Nurseryville',
        state: 'CA',
        pincode: '90001',
        phone: '555-123-4567'
      },
      paymentMethod: 'COD',
      itemsPrice: 60.00,
      shippingPrice: 0,
      totalPrice: 60.00
    };

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderPayload);

    expect(orderRes.status).toBe(201);
    expect(orderRes.body).toHaveProperty('_id');

    // Verify product stock decremented from 10 to 6 (10 - 4 = 6)
    const updatedProduct = await Product.findById(productId);
    expect(updatedProduct.stock).toBe(6);
  });
});
