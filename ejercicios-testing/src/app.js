const express = require('express');

const app = express();

app.use(express.json());

const initialContacts = [
  {
    id: 1,
    name: 'Kevin',
    email: 'kevin@gmail.com',
    phone: '3001234567'
  },
  {
    id: 2,
    name: 'Maria',
    email: 'maria@gmail.com',
    phone: '3119876543'
  }
];

let contacts = [];
let nextId = 1;

// Reiniciar datos para tests
const resetContacts = () => {
  contacts = JSON.parse(JSON.stringify(initialContacts));
  nextId = 3;
};

resetContacts();


// GET todos
app.get('/api/contacts', (req, res) => {
  res.status(200).json(contacts);
});


// GET por ID
app.get('/api/contacts/:id', (req, res) => {

  const contact = contacts.find(
    c => c.id === Number(req.params.id)
  );

  if (!contact) {
    return res.status(404).json({
      error: 'Contacto no encontrado'
    });
  }

  res.json(contact);
});


// POST crear
app.post('/api/contacts', (req, res) => {

  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'El nombre es obligatorio'
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: 'Email inválido'
    });
  }

  const newContact = {
    id: nextId++,
    name,
    email,
    phone: phone || ''
  };

  contacts.push(newContact);

  res.status(201).json(newContact);
});


// PUT actualizar
app.put('/api/contacts/:id', (req, res) => {

  const contact = contacts.find(
    c => c.id === Number(req.params.id)
  );

  if (!contact) {
    return res.status(404).json({
      error: 'Contacto no encontrado'
    });
  }

  const { email } = req.body;

  if (email && !email.includes('@')) {
    return res.status(400).json({
      error: 'Email inválido'
    });
  }

  Object.assign(contact, req.body);

  res.json(contact);
});


// DELETE eliminar
app.delete('/api/contacts/:id', (req, res) => {

  const index = contacts.findIndex(
    c => c.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: 'Contacto no encontrado'
    });
  }

  contacts.splice(index, 1);

  res.status(200).json({
    message: 'Contacto eliminado.'
  });
});

module.exports = {
  app,
  resetContacts
};