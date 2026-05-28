const request = require('supertest');

const {
  app,
  resetContacts
} = require('../src/app');

beforeEach(() => {
  resetContacts();
});

describe('Contacts API', () => {

  test('GET /api/contacts devuelve status 200 y un array', async () => {

    const res = await request(app)
      .get('/api/contacts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });


  test('GET /api/contacts/:id devuelve el contacto correcto', async () => {

    const res = await request(app)
      .get('/api/contacts/1');

    expect(res.status).toBe(200);

    expect(res.body).toMatchObject({
      id: 1,
      name: 'Kevin'
    });
  });


  test('GET /api/contacts/:id devuelve 404', async () => {

    const res = await request(app)
      .get('/api/contacts/999');

    expect(res.status).toBe(404);
  });


  test('POST /api/contacts crea contacto', async () => {

    const res = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Carlos',
        email: 'carlos@gmail.com',
        phone: '3200000000'
      });

    expect(res.status).toBe(201);

    expect(res.body).toMatchObject({
      name: 'Carlos',
      email: 'carlos@gmail.com'
    });
  });


  test('POST devuelve 400 si falta name', async () => {

    const res = await request(app)
      .post('/api/contacts')
      .send({
        email: 'correo@gmail.com'
      });

    expect(res.status).toBe(400);
  });


  test('POST devuelve 400 si email es inválido', async () => {

    const res = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Pedro',
        email: 'correo-invalido'
      });

    expect(res.status).toBe(400);
  });


  test('PUT actualiza correctamente', async () => {

    const res = await request(app)
      .put('/api/contacts/1')
      .send({
        phone: '999999999'
      });

    expect(res.status).toBe(200);

    expect(res.body.phone).toBe('999999999');
  });


  test('DELETE elimina contacto', async () => {

    const res = await request(app)
      .delete('/api/contacts/1');

    expect(res.status).toBe(200);

    expect(res.body.message).toMatch(/eliminado/i);
  });


  test('DELETE devuelve 404', async () => {

    const res = await request(app)
      .delete('/api/contacts/999');

    expect(res.status).toBe(404);
  });

});