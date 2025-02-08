require('dotenv').config();

const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const userRoutes = require('./routes/userRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ai', aiRoutes);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Serve Swagger JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

const connectDB = require('./config/db');
connectDB();

app.listen(process.env.PORT || 3000, () => 
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
