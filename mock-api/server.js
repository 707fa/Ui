import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// File paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json'); // Maps to /inventory/quants/
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json'); // Maps to /sale/orders/
const EMPLOYEES_FILE = path.join(__dirname, 'data', 'employees.json'); // Maps to /hr/employees/
const PRODUCTIONS_FILE = path.join(__dirname, 'data', 'productions.json'); // Maps to /manufacturing/productions/
const INVOICES_FILE = path.join(__dirname, 'data', 'invoices.json'); // Maps to /accounting/invoices/
const LEADS_FILE = path.join(__dirname, 'data', 'leads.json'); // Maps to /crm/leads/

// Ensure all data files exist
[USERS_FILE, PRODUCTS_FILE, ORDERS_FILE, EMPLOYEES_FILE, PRODUCTIONS_FILE, INVOICES_FILE, LEADS_FILE].forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([]));
    }
});

// Generic Helper to read data
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return [];
    }
};

// Generic Helper to save data
const saveData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Use generic helpers for users now too, to keep DRY
const getUsers = () => readData(USERS_FILE);
const saveUsers = (users) => saveData(USERS_FILE, users);

// --- PRODUCTS API ---

app.get('/api/inventory/quants/', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    res.json(products);
});

app.post('/api/inventory/quants/', (req, res) => {
    const { name, price, category, stock, image } = req.body;
    if (!name || !price) {
        return res.status(400).json({ success: false, error: 'Name and Price are required' });
    }

    const products = readData(PRODUCTS_FILE);
    const newProduct = {
        id: Date.now().toString(),
        name,
        price: Number(price),
        category: category || "General",
        stock: Number(stock) || 0,
        status: (Number(stock) || 0) > 10 ? "In Stock" : (Number(stock) || 0) > 0 ? "Low Stock" : "Out of Stock",
        image: image || "bg-gray-100 text-gray-600"
    };

    products.push(newProduct);
    saveData(PRODUCTS_FILE, products);
    res.json({ success: true, product: newProduct });
});

// Update stock endpoint (for manual adjustments)
app.put('/api/inventory/quants/:id/', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    let products = readData(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        // Recalculate status if stock changed
        if (updates.stock !== undefined) {
            products[index].status = products[index].stock > 10 ? "In Stock" : products[index].stock > 0 ? "Low Stock" : "Out of Stock";
        }
        saveData(PRODUCTS_FILE, products);
        res.json({ success: true, product: products[index] });
    } else {
        res.status(404).json({ success: false, error: 'Product not found' });
    }
});

// --- ORDERS API ---

app.get('/api/sale/orders/', (req, res) => {
    const orders = readData(ORDERS_FILE);
    // Return sorted by date desc
    res.json(orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
});

app.post('/api/sale/orders/', (req, res) => {
    const { items, total, customer } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    const orders = readData(ORDERS_FILE);
    const newOrder = {
        id: `#ORD-${1000 + orders.length + 1}`,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        customer: customer || "Walk-in Customer",
        total: total,
        status: "Paid", // Default for POS
        items: items.reduce((acc, item) => acc + item.quantity, 0),
        details: items // Store full details
    };

    orders.push(newOrder);
    saveData(ORDERS_FILE, orders);

    // Update Product Stock
    let products = readData(PRODUCTS_FILE);
    items.forEach(cartItem => {
        const productIndex = products.findIndex(p => String(p.id) === String(cartItem.id));
        if (productIndex !== -1) {
            products[productIndex].stock = Math.max(0, products[productIndex].stock - cartItem.quantity);
            // Update status
            products[productIndex].status = products[productIndex].stock > 10 ? "In Stock" : products[productIndex].stock > 0 ? "Low Stock" : "Out of Stock";
        }
    });
    saveData(PRODUCTS_FILE, products);

    res.json({ success: true, order: newOrder });
});

// --- HR API ---
app.get('/api/hr/employees/', (req, res) => {
    res.json(readData(EMPLOYEES_FILE));
});

app.post('/api/hr/employees/', (req, res) => {
    const employees = readData(EMPLOYEES_FILE);
    const newEmployee = { ...req.body, id: Date.now().toString() };
    employees.push(newEmployee);
    saveData(EMPLOYEES_FILE, employees);
    res.json({ success: true, employee: newEmployee });
});

// --- MANUFACTURING API ---
app.get('/api/manufacturing/productions/', (req, res) => {
    res.json(readData(PRODUCTIONS_FILE));
});

app.post('/api/manufacturing/productions/', (req, res) => {
    const productions = readData(PRODUCTIONS_FILE);
    const efficiency = Math.floor(Math.random() * (100 - 85 + 1) + 85) + "%"; // Dynamic mock efficiency
    const newProduction = { ...req.body, id: Date.now().toString(), efficiency };
    productions.push(newProduction);
    saveData(PRODUCTIONS_FILE, productions);
    res.json({ success: true, order: newProduction });
});

// --- ACCOUNTING API ---
app.get('/api/accounting/invoices/', (req, res) => {
    res.json(readData(INVOICES_FILE));
});

app.post('/api/accounting/invoices/', (req, res) => {
    const invoices = readData(INVOICES_FILE);
    const newInvoice = { ...req.body, id: `#INV-${1000 + invoices.length + 1}` };
    invoices.push(newInvoice);
    saveData(INVOICES_FILE, invoices);
    res.json({ success: true, invoice: newInvoice });
});

// --- CRM / PROJECTS API ---
app.get('/api/crm/leads/', (req, res) => {
    const leads = readData(LEADS_FILE);
    if (!leads.length) {
        // Init default columns if empty
        const defaultColumns = [
            { title: "To Do", color: "gray", items: [] },
            { title: "In Progress", color: "blue", items: [] },
            { title: "Completed", color: "green", items: [] }
        ];
        saveData(LEADS_FILE, defaultColumns);
        return res.json(defaultColumns);
    }
    res.json(leads);
});

app.post('/api/crm/leads/', (req, res) => {
    const { column, ...task } = req.body;
    let leads = readData(LEADS_FILE);
    const columnIndex = leads.findIndex(col => col.title === column);
    const newTask = { ...task, id: Date.now().toString() };

    if (columnIndex !== -1) {
        leads[columnIndex].items.push(newTask);
        saveData(LEADS_FILE, leads);
    }
    res.json({ success: true, task: newTask });
});

// --- DASHBOARD API ---
app.get('/api/dashboard-stats', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const products = readData(PRODUCTS_FILE);

    const totalRevenue = orders.reduce((sum, order) => sum + (typeof order.total === 'string' ? parseFloat(order.total.replace(/[^0-9.-]+/g, "")) : order.total), 0);
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Recent activity mocked from orders
    const activities = orders.slice(-5).reverse().map(o => ({
        id: o.id,
        text: `New Order ${o.id}`,
        subtext: `Just now • Sales`,
        type: 'sale'
    }));

    res.json({
        revenue: totalRevenue,
        ordersCount: orders.length,
        stockValue: totalStockValue,
        activities
    });
});

// --- AUTH API ---

// Helper: Hash password
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
};

// Helper: Verify password
const verifyPassword = (password, user) => {
    if (!user.salt) {
        // Legacy plain text check (and upgrade if we wanted to, but let's just allow it)
        return user.password === password;
    }
    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    return user.hash === hash;
};

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const users = getUsers();

    if (users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    if (users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).json({ success: false, error: 'Username already taken' });
    }

    const { salt, hash } = hashPassword(password);

    const newUser = {
        id: Date.now().toString(),
        username: username.trim(),
        email: email.trim(),
        salt,
        hash,
        displayName: username.trim()
    };

    users.push(newUser);
    saveUsers(users);

    // Return user info without auth data
    const { salt: _s, hash: _h, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { login, password } = req.body || {};

    if (!login || !password) {
        return res.status(400).json({ success: false, error: 'Login and Password are required' });
    }

    const users = getUsers();
    const user = users.find(u =>
        u.username && u.username.trim().toLowerCase() === login.trim().toLowerCase()
    );

    if (user && verifyPassword(password, user)) {
        // Exclude secret fields
        const { password: _p, salt: _s, hash: _h, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// Check email endpoint
app.post('/api/check-email', (req, res) => {
    const { email } = req.body || {};
    if (!email) {
        return res.json({ exists: false });
    }
    const users = getUsers();
    const exists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    res.json({ exists });
});

// Check username endpoint
app.post('/api/check-username', (req, res) => {
    const { username } = req.body || {};
    if (!username) {
        return res.json({ exists: false });
    }
    const users = getUsers();
    const exists = users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase());
    res.json({ exists });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
