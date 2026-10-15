import express from 'express';
import usuariosRoutes from './routes/usuarios.routes';
import ambientesRoutes from './routes/ambientes.routes';
import equiposRoutes from './routes/equipos.routes';
import novedadesRoutes from './routes/novedades.routes';
import dashboardRoutes from './routes/dashboard.routes';
import healthRoutes from './routes';

const app = express();

app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ambientes', ambientesRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/novedades', novedadesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;
