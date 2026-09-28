import { Router } from 'express';
import {
  listarRecetasApi,
  obtenerRecetaApi,
  crearRecetaApi,
  actualizarRecetaApi,
  eliminarRecetaApi
} from '../../controllers/api/recetasApiController.js';

const router = Router();

router.get('/', listarRecetasApi);
router.get('/:id', obtenerRecetaApi);
router.post('/', crearRecetaApi);
router.put('/:id', actualizarRecetaApi);
router.delete('/:id', eliminarRecetaApi);

export default router;
