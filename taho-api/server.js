// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- DATA ----------------
const PRODUCTS = [
  { id: 1, category: "classic", name: "Classic Arnibal", size: "Large", price: 95, desc: "Traditional silken tofu with sweet arnibal syrup and chewy sago pearls" },
  { id: 2, category: "specialty", name: "Biscoff Taho", size: "Large", price: 150, desc: "Classic taho topped with Biscoff cookie spread with whipped cream and real Biscoff crumble" },
  { id: 3, category: "specialty", name: "Cookies & Cream Taho", size: "Large", price: 150, desc: "Classic taho topped with Cookies & Cream spread with whipped cream and crumbled cookies" },
  { id: 4, category: "specialty", name: "Salted Toffee", size: "Large", price: 150, desc: "Silky tofu with salted toffee syrup with whipped cream and chewy sago pearls" },
  { id: 5, category: "specialty", name: "Strawberry", size: "Large", price: 105, desc: "Fresh strawberry syrup with soft tofu and sago pearls" },
  { id: 6, category: "specialty", name: "Pandan Taho", size: "Large", price: 105, desc: "Creamy Pandan syrup with fresh buko and silken tofu and sago pearls" },
  { id: 7, category: "specialty", name: "Matcha Taho", size: "Large", price: 105, desc: "Japanese matcha syrup with soft tofu and sago pearls" },
  { id: 8, category: "specialty", name: "Mango Taho", size: "Large", price: 105, desc: "Seasonal fresh mango syrup with soft tofu and mango jelly" },
  { id: 9, category: "toppings", name: "Extra Syrup", price: 20 },
  { id: 10, category: "toppings", name: "Extra Graham", price: 20 },
  { id: 11, category: "toppings", name: "Extra Sago", price: 20 },
  { id: 12, category: "toppings", name: "Add Nata", price: 20 },
  { id: 13, category: "toppings", name: "Add Coffee Jelly", price: 20 },
  { id: 14, category: "toppings", name: "Add Whipped Cream", price: 20 },
  { id: 15, category: "cookies", name: "Choco Chips Cookies", size: "Per Piece", price: 79, desc: "The OG Cookie — Classic chocolate chip flavor with Callebaut belgian chocolate and 57% dark couverture chocolate" },
  { id: 16, category: "cookies", name: "Matcha Cookies", size: "Per Piece", price: 89, desc: "Matcha flavored cookie filled with cream cheese and white chocolate chips" },
  { id: 17, category: "cookies", name: "Smore's Cookie", size: "Per Piece", price: 89, desc: "Mallows with graham crackers, Callebaut belgian chocolate, and 57% dark couverture chocolate" },
  { id: 18, category: "cookies", name: "Red Velvet Cookie", size: "Per Piece", price: 89, desc: "Red velvet cookie filled with cream cheese and white chocolate chip" },
  { id: 19, category: "cookies", name: "Biscoff Cookie", size: "Per Piece", price: 89, desc: "Lotus Biscoff spread with dark couverture chocolate" },
  { id: 20, category: "cookies", name: "Walnut Cookie", size: "Per Piece", price: 89, desc: "Perfect combination of classic chocolate chip and walnut" }
];

const CUSTOMERS = [
  { id: 1, firstName: 'Juan', lastName: 'Dela Cruz', email: 'juan@example.com', phone: '09171234567', joined: '2025-07-10' },
  { id: 2, firstName: 'Maria', lastName: 'Santos', email: 'maria@example.com', phone: '09179876543', joined: '2025-08-02' },
  { id: 3, firstName: 'Jonas', lastName: 'Bondoc', email: 'jonas@example.com', phone: '09170001111', joined: '2025-09-15' },
];

const MESSAGES = [
  { id: 1, name: 'Juan D.', email: 'juan@example.com', message: 'How much for extra sago?', dateSent: '2025-09-01' },
  { id: 2, name: 'Maria S.', email: 'maria@example.com', message: 'Do you accept large orders?', dateSent: '2025-09-05' },
  { id: 3, name: 'Ana L.', email: 'ana@example.com', message: 'Where is your stall located?', dateSent: '2025-09-20' },
];

// ---------------- HELPER ----------------
function searchArray(arr, q) {
  if (!q) return arr;
  q = q.trim().toLowerCase();
  return arr.filter(item => {
    return Object.values(item).some(val => {
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(q);
    });
  });
}

function nextProductId() {
  if (!PRODUCTS.length) return 1;
  return Math.max(...PRODUCTS.map(p => p.id)) + 1;
}

// ---------------- DASHBOARD ROUTE ----------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ---------------- API ROUTES ----------------

// GET all products (supports q and category)
app.get('/api/products', (req, res) => {
  const q = req.query.q || '';
  const category = req.query.category;
  let results = PRODUCTS.slice();

  if (category) {
    results = results.filter(p => String(p.category).toLowerCase() === String(category).toLowerCase());
  }
  if (q) results = searchArray(results, q);
  res.json({ count: results.length, data: results });
});

// GET single product by id
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// CREATE product
app.post('/api/products', (req, res) => {
  const body = req.body || {};
  // basic validation
  if (!body.name || !body.category || (body.price === undefined || body.price === null)) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price' });
  }

  const newProduct = {
    id: nextProductId(),
    name: String(body.name),
    category: String(body.category),
    desc: body.desc ? String(body.desc) : '',
    size: body.size ? String(body.size) : '',
    price: Number(body.price)
  };

  PRODUCTS.push(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// UPDATE product
app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = PRODUCTS.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const body = req.body || {};
  // update only allowed fields
  PRODUCTS[idx].name = body.name !== undefined ? String(body.name) : PRODUCTS[idx].name;
  PRODUCTS[idx].category = body.category !== undefined ? String(body.category) : PRODUCTS[idx].category;
  PRODUCTS[idx].desc = body.desc !== undefined ? String(body.desc) : PRODUCTS[idx].desc;
  PRODUCTS[idx].size = body.size !== undefined ? String(body.size) : PRODUCTS[idx].size;
  PRODUCTS[idx].price = body.price !== undefined ? Number(body.price) : PRODUCTS[idx].price;

  res.json({ success: true, product: PRODUCTS[idx] });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = PRODUCTS.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const removed = PRODUCTS.splice(idx, 1);
  res.json({ success: true, product: removed[0] });
});

// --- customers & messages (GET only) ---
app.get('/api/customers', (req, res) => {
  const q = req.query.q || '';
  let results = CUSTOMERS.slice();
  if (q) results = searchArray(results, q);
  res.json({ count: results.length, data: results });
});

app.get('/api/messages', (req, res) => {
  const q = req.query.q || '';
  let results = MESSAGES.slice();
  if (q) results = searchArray(results, q);
  res.json({ count: results.length, data: results });
});

// ---------------- STATIC + DASHBOARD ----------------
app.use(express.static(path.join(__dirname, 'public')));

// minimal health endpoint
app.get('/health', (req, res) => res.send({ status: 'OK', time: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
