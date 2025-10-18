const request = require('supertest');
const app = require('./server');

describe('E-Commerce API', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return all products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(4);
  });

  it('should return single product', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(1);
  });

  it('should create order', async () => {
    const orderData = {
      productId: 2,
      quantity: 1,
      customerName: 'Test User',
      customerEmail: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/orders')
      .send(orderData);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
