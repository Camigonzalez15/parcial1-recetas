import express from 'express';
import { connectDB } from './config/db.js';
import recetasRoutes from './routes/recetasRoutes.js';
import recetasApiRoutes from './routes/api/recetasApiRoutes.js';
import colaboradoresApiRoutes from './routes/api/colaboradoresApiRoutes.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/recetas');
});

app.use('/recetas', recetasRoutes);
app.use('/api/recetas', recetasApiRoutes);
app.use('/api/colaboradores', colaboradoresApiRoutes);

const PORT = 3333;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
});