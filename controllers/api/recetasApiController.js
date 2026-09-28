import {
  getAllRecetas,
  getRecetasByFilters,
  buildRecetaFilter,
  getRecetaById,
  createReceta,
  updateReceta,
  deleteReceta
} from '../../services/recetasService.js';

export async function listarRecetasApi(req, res) {
  try {
    const section = typeof req.query?.section === 'string' ? req.query.section.trim().toLowerCase() : '';
    const name = typeof req.query?.name === 'string' ? req.query.name.trim() : '';

    const filter = buildRecetaFilter({ section, name });
    const recetas = Object.keys(filter).length === 0 && !section && !name
      ? await getAllRecetas()
      : await getRecetasByFilters(filter);

    return res.json(recetas);
  } catch (error) {
    console.error('Error al listar recetas API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function obtenerRecetaApi(req, res) {
  try {
    const { id } = req.params;
    const receta = await getRecetaById(id);

    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    return res.json(receta);
  } catch (error) {
    console.error('Error al obtener receta por ID API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function crearRecetaApi(req, res) {
  try {
    const { name, section } = req.body || {};

    if (typeof name !== 'string' || !name.trim() || typeof section !== 'string' || !section.trim()) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: name y section son obligatorios.'
      });
    }

    const resultado = await createReceta(req.body);
    const recetaCreada = await getRecetaById(resultado.insertedId.toString());

    if (!recetaCreada) {
      return res.status(500).json({ error: 'No se pudo recuperar la receta creada' });
    }

    return res.status(201).json(recetaCreada);
  } catch (error) {
    console.error('Error al crear receta API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function actualizarRecetaApi(req, res) {
  try {
    const { id } = req.params;
    const recetaExistente = await getRecetaById(id);

    if (!recetaExistente) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    await updateReceta(id, req.body);
    const recetaActualizada = await getRecetaById(id);

    return res.json(recetaActualizada);
  } catch (error) {
    console.error('Error al actualizar receta API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function eliminarRecetaApi(req, res) {
  try {
    const { id } = req.params;
    const recetaExistente = await getRecetaById(id);

    if (!recetaExistente) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    await deleteReceta(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar receta API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
