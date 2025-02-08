const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add global middleware
app.use(requestLogger);
app.use(apiLimiter);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Crypto Trading API Documentation"
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/userRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const aiAgentRoutes = require('./routes/aiAgentRoutes');
const agentResponseRoutes = require('./routes/agentResponseRoutes');
const authRoutes = require('./routes/authRoutes');
const promptRoutes = require('./routes/promptRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ai-agents', aiAgentRoutes);
app.use('/api/agent-responses', agentResponseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;
