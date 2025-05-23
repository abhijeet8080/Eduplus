const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const storeRoutes = require('./routes/store.routes');
const ratingRoutes = require('./routes/rating.routes');
const { authenticate, authorize } = require('./middlewares/auth.middleware');
const { getDashboardStats } = require('./controllers/auth.controller');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/dashboard/stats',authenticate,authorize('ADMIN'),getDashboardStats)
module.exports = app;
