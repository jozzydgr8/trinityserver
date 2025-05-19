require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Routes (update path as needed based on your project structure)
const emailRoutes = require('../routes/emailConfig');
const paymentRoutes = require('../routes/stripePayment');
const retrieveStripe = require('../routes/retrievestripe');

app.use(emailRoutes);
app.use(paymentRoutes);
app.use(retrieveStripe);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
