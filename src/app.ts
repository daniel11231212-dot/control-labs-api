import express from 'express';
import usuariosRoutes from './routes/usuarios.routes';
import ambientesRoutes from './routes/ambientes.routes';
import equiposRoutes from './routes/equipos.routes';
import novedadesRoutes from './routes/novedades.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { requestLogger } from './middlewares/logger.middleware';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ambientes', ambientesRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/novedades', novedadesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

app.use(globalErrorHandler);

export default app;
