const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../db');

beforeAll(async () => {
  // Sync database before tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection after tests
  await sequelize.close();
});

describe('Expense Tracker API', () => {
  it('GET /api/expenses returns empty array initially', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/expenses creates a new expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ description: 'Coffee', amount: 3.50 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.description).toBe('Coffee');
    expect(res.body.amount).toBe(3.50);
  });

  it('DELETE /api/expenses/:id deletes an expense', async () => {
    const postRes = await request(app)
      .post('/api/expenses')
      .send({ description: 'Tea', amount: 2.50 });
    const id = postRes.body.id;
    const deleteRes = await request(app).delete(`/api/expenses/${id}`);
    expect(deleteRes.status).toBe(204);
  });

  it('PUT /api/expenses/:id updates an expense', async () => {
    const postRes = await request(app)
      .post('/api/expenses')
      .send({ description: 'Lunch', amount: 10.00 });
    const id = postRes.body.id;
    const updateRes = await request(app)
      .put(`/api/expenses/${id}`)
      .send({ description: 'Updated Lunch', amount: 12.00 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.description).toBe('Updated Lunch');
    expect(updateRes.body.amount).toBe(12.00);
  });
});