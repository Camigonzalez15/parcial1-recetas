import { Router } from 'express';
import {
  listarRecetas,
  listarPorSeccion,
  mostrarFormularioCrear,
  crearRecetaController,
  mostrarFormularioEditar,
  actualizarRecetaController,
  eliminarRecetaController
} from '../controllers/recetasController.js';

const router = Router();

// 1. Listar todas las recetas (Read)
router.get('/', listarRecetas);

// 2. Alta de recetas (Create)
router.get('/crear', mostrarFormularioCrear);
router.post('/crear', crearRecetaController);

// 3. Modificación de recetas (Update)
router.get('/editar/:id', mostrarFormularioEditar);
router.post('/editar/:id', actualizarRecetaController);

// 4. Baja de recetas (Delete)
router.post('/eliminar/:id', eliminarRecetaController);

// 5. Filtrar por sección o por query params (al final para evitar colisiones con /crear o /editar)
router.get('/:section', listarRecetas);

export default router;
