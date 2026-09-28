import {
  getAllColaboradores,
  getColaboradorById,
  createColaborador
} from '../services/colaboradoresService.js';

export async function listarColaboradores(req, res) {
  try {
    const colaboradores = await getAllColaboradores();
    return res.json(colaboradores);
  } catch (error) {
    console.error('Error al listar colaboradores:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function obtenerColaborador(req, res) {
  try {
    const { id } = req.params;
    const colaborador = await getColaboradorById(id);

    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador no encontrado' });
    }

    return res.json(colaborador);
  } catch (error) {
    console.error('Error al obtener colaborador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function crearColaboradorController(req, res) {
  try {
    const resultado = await createColaborador(req.body || {});
    const colaboradorCreado = await getColaboradorById(resultado.insertedId.toString());

    if (!colaboradorCreado) {
      return res.status(500).json({ error: 'No se pudo recuperar el colaborador creado' });
    }

    return res.status(201).json(colaboradorCreado);
  } catch (error) {
    console.error('Error al crear colaborador:', error);
    return res.status(400).json({ error: error.message || 'Error al crear colaborador' });
  }
}
