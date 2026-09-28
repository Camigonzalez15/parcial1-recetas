import { Router } from 'express';
import {
  listarColaboradores,
  obtenerColaborador,
  crearColaboradorController
} from '../../controllers/colaboradoresController.js';

const router = Router();

router.get('/', listarColaboradores);
router.get('/:id', obtenerColaborador);
router.post('/', crearColaboradorController);

export default router;
