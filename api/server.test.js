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

describe('testing user model', () => {

  test('table defaults to empty', async () => {
    const users = await db('users');
    expect(users).toHaveLength(0);
  });

  test('can add user', async () => {
    const user = await Users.add({ username: 'Natasha', password: '1234' });
    expect(user).toHaveProperty('username', 'Natasha');
  });

  test('can fetch user', async () => {
    // Add user
    const {id} = await Users.add({ username: 'Tony', password: '1234' });
    // Fetch user
    const user = await Users.getById(id);
    expect(user).toHaveProperty('username', 'Tony');
  });
  
  test('can find user by username', async () => {
    // Add user
    const {username} = await Users.add({ username: 'Bruce', password: '1234' });
    // Find user
    const users = await Users.getBy({username});
    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty('username', 'Bruce');
  });

})

describe('testing API endpoints', () => {

  test('[POST] /api/auth/register - successful registration', async () => {
    let user = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Barry', password: '1234' });
    expect(user.body).toHaveProperty('username', 'Barry');
  });
  
  test('[POST] /api/auth/register - missing field', async () => {
    let error = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Clark' });
    expect(error.body).toHaveProperty('message', 'username and password required');
  });

  test('[POST] /api/auth/register - duplicate username', async () => {
    // Create User
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'Clint', password: '1234' });
    // Attempt to create a user with a duplicate username
    let error = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Clint', password: '1234' });
    expect(error.body).toHaveProperty('message', 'username taken');
  });

  test('[POST] /api/auth/login - successful login', async () => {
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
  
  test('[POST] /api/auth/login - missing field', async () => {
    // Create User
    let user = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Steve', password: '1234' });
    // Login with incorrect User Credentials
    let error = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Steve' });
    expect(error.body).toHaveProperty('message', 'username and password required');
  });
  
  test('[POST] /api/auth/login - wrong password', async () => {
    // Create User
    let user = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Steve', password: '1234' });
    // Login with incorrect User Credentials
    let error = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Steve', password: '12345' });
    expect(error.body).toHaveProperty('message', 'invalid credentials');
  });

  test('[GET] /api/jokes', async () => {
    // Create User
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'Peter', password: '1234' });
    // Login
    let user = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Peter', password: '1234' });
    // Fetch Jokes
    let res = await request(server)
      .get('/api/jokes')
      // .set('Authorization', `Bearer ${user.body.token}`);
      .set('Authorization', `Bearer 1234`);
    expect(res.error.status).toBe(401);
  });

});
