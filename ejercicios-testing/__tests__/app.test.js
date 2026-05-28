const request = require('supertest');

const {
  app,
  resetContacts
} = require('../src/app');

beforeEach(() => {
  resetContacts();
});

describe('API CONTACTS EXTENDIDA', () => {

  // ======================================================
  // BLOQUE A - VALIDACIÓN REGEX EMAIL
  // ======================================================

  describe('Validación de email', () => {

    test('Devuelve 400 cuando email es "@"', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: '@'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    test('Devuelve 400 cuando email es "usuario@"', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: 'usuario@'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    test('Devuelve 400 cuando email es "@dominio.com"', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: '@dominio.com'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    test('Devuelve 400 cuando email no tiene arroba', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: 'sin-arroba'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    test('Devuelve 201 cuando email es válido', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: 'usuario@dominio.com'
        });

      expect(res.status).toBe(201);

      expect(res.body).toMatchObject({
        name: 'Test',
        email: 'usuario@dominio.com'
      });
    });

  });


  // ======================================================
  // BLOQUE B - EMAIL DUPLICADO
  // ======================================================

  describe('Detección de emails duplicados', () => {

    test('Crear contacto con email existente devuelve 409', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Nuevo',
          email: 'ana@example.com'
        });

      expect(res.status).toBe(409);
    });

    test('409 contiene campo error', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Nuevo',
          email: 'ana@example.com'
        });

      expect(res.body).toHaveProperty('error');
    });

    test('Email duplicado en mayúsculas también devuelve 409', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Nuevo',
          email: 'ANA@EXAMPLE.COM'
        });

      expect(res.status).toBe(409);
    });

    test('Después del 409 la cantidad de contactos no cambia', async () => {

      await request(app)
        .post('/api/contacts')
        .send({
          name: 'Nuevo',
          email: 'ana@example.com'
        });

      const listRes = await request(app)
        .get('/api/contacts');

      expect(listRes.body).toHaveLength(3);
    });

  });


  // ======================================================
  // BLOQUE C - SEARCH Y FILTER
  // ======================================================

  describe('Búsqueda y filtros', () => {

    test('?search=ana devuelve coincidencias', async () => {

      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'ana' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);

      expect(res.body[0].name).toMatch(/ana/i);
    });

    test('?search=ANA funciona igual', async () => {

      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'ANA' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    test('?search=example filtra por email', async () => {

      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'example' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    test('?search=xyznoexiste devuelve array vacío', async () => {

      const res = await request(app)
        .get('/api/contacts')
        .query({ search: 'xyznoexiste' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test('?favorite=true devuelve solo favoritos', async () => {

      const res = await request(app)
        .get('/api/contacts')
        .query({ favorite: 'true' });

      expect(res.status).toBe(200);

      expect(
        res.body.every(c => c.favorite === true)
      ).toBe(true);

      expect(res.body).toHaveLength(1);
    });

    test('Sin query params devuelve todos', async () => {

      const res = await request(app)
        .get('/api/contacts');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

  });


  // ======================================================
  // BLOQUE D - PATCH FAVORITE
  // ======================================================

  describe('PATCH favorite toggle', () => {

    test('Ana pasa de false a true', async () => {

      const res = await request(app)
        .patch('/api/contacts/1/favorite');

      expect(res.status).toBe(200);
      expect(res.body.favorite).toBe(true);
    });

    test('Doble toggle vuelve a false', async () => {

      await request(app)
        .patch('/api/contacts/1/favorite');

      await request(app)
        .patch('/api/contacts/1/favorite');

      const res = await request(app)
        .get('/api/contacts/1');

      expect(res.body.favorite).toBe(false);
    });

    test('Luis pasa de true a false', async () => {

      const res = await request(app)
        .patch('/api/contacts/2/favorite');

      expect(res.body.favorite).toBe(false);
    });

    test('PATCH devuelve 404 para ID inexistente', async () => {

      const res = await request(app)
        .patch('/api/contacts/999/favorite');

      expect(res.status).toBe(404);
    });

    test('El cambio persiste después del PATCH', async () => {

      await request(app)
        .patch('/api/contacts/1/favorite');

      const res = await request(app)
        .get('/api/contacts/1');

      expect(res.body.favorite).toBe(true);
    });

  });


  // ======================================================
  // BLOQUE E - PUT MEJORADO
  // ======================================================

  describe('PUT actualizado', () => {

    test('Actualizar solo el name devuelve 200', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          name: 'Ana Nueva'
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Ana Nueva');
    });

    test('PUT con email inválido devuelve 400', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          email: 'correo-malo'
        });

      expect(res.status).toBe(400);
    });

    test('PUT con email duplicado devuelve 409', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          email: 'luis@example.com'
        });

      expect(res.status).toBe(409);
    });

    test('PUT con mismo email actual devuelve 200', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          email: 'ana@example.com'
        });

      expect(res.status).toBe(200);
    });

    test('PUT en ID inexistente devuelve 404', async () => {

      const res = await request(app)
        .put('/api/contacts/999')
        .send({
          name: 'Nuevo'
        });

      expect(res.status).toBe(404);
    });

  });


  // ======================================================
  // BLOQUE F - MIDDLEWARE ERROR
  // ======================================================

  describe('Middleware de errores', () => {

    test('Ruta inexistente devuelve 404 JSON', async () => {

      const res = await request(app)
        .get('/api/ruta-que-no-existe')
        .expect('Content-Type', /json/);

      expect(res.status).toBe(404);
    });

    test('404 genérico contiene campo error', async () => {

      const res = await request(app)
        .get('/api/ruta-que-no-existe');

      expect(res.body).toHaveProperty('error');
    });

    test('Errores contienen campo status', async () => {

      const res404 = await request(app)
        .get('/api/contacts/9999');

      expect(res404.body).toHaveProperty('status', 404);

      const res400 = await request(app)
        .post('/api/contacts')
        .send({
          name: '',
          email: 'correo'
        });

      expect(res400.body).toHaveProperty('status', 400);

      const res409 = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: 'ana@example.com'
        });

      expect(res409.body).toHaveProperty('status', 409);
    });

  });

});