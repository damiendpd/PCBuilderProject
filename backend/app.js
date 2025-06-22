import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Lecture du fichier Swagger
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'docs', 'api-docs.json'), 'utf8')
);

// Middlewares globaux
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.routes.js';
import componentRoutes from './routes/component.routes.js';
import userRoutes from './routes/user.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import configurationRoutes from './routes/configuration.routes.js';
import savedConfigRoutes from './routes/savedConfig.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/configurations', savedConfigRoutes);

// Route Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée.' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('🔥 Erreur serveur:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur.',
  });
});

export default app;