const express = require('express');
const countriesRoutes = require('./routes/countries');

const app = express();

// Middleware
app.use(express.json());
app.use('/api/countries', countriesRoutes);

module.exports = app;