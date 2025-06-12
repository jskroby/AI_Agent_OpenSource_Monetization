const request = require('supertest');
const app = require('../fart_to_midi');

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll(() => {
  server.close();
});

test('GET / returns index', async () => {
  const res = await request(server).get('/');
  expect(res.status).toBe(200);
  expect(res.text).toContain('Fart ➜ MIDI');
});
