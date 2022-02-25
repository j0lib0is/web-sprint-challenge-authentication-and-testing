const db = require('../data/dbConfig');
const Users = require('./users/users-model');
const request = require('supertest');
const server = require('./server');

// Write your tests here

// Sanity Test
test('sanity', () => {
  expect(1+2).toEqual(3);
})

// Before
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
})

describe('testing API endpoints', () => {

  // test('[GET] /api/jokes', async () => {
  //   const jokes = await request(server).get('/api/jokes');
  //   expect(jokes.body).toBeInstanceOf(Array);
  // });

  test('[POST] /api/auth/register', async () => {
    // POST REQUEST
    let user = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Jack', password: '1234' });
    expect(user.body).toHaveProperty('username', 'Jack');
  });

  test('[POST] /api/auth/login', async () => {
    // Create User
    let user = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Jack', password: '1234' });
    expect(user.body).toHaveProperty('username', 'Jack');
    // Check database
    let users = await db('users');
    expect(users).toHaveLength(1);
    // Login with User Credentials
    let welcome = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Jack', password: '1234' });
    expect(welcome.body).toHaveProperty('message', 'welcome, Jack');
  });

});
