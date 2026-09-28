import {
  getAllRecetas,
  getRecetasBySection,
  getRecetasByFilters,
  buildRecetaFilter,
  getRecetaById,
  createReceta,
  updateReceta,
  deleteReceta,
} from '../services/recetasService.js';

import { getAllColaboradores } from '../services/colaboradoresService.js';

export async function listarRecetas(req, res) {
  try {
    const sectionFromParams = typeof req.params?.section === 'string' ? req.params.section : '';
    const sectionFromQuery = typeof req.query?.section === 'string' ? req.query.section : '';
    const section = (sectionFromParams || sectionFromQuery).trim().toLowerCase();
    const name = typeof req.query?.name === 'string' ? req.query.name.trim() : '';
    const recetas = await getRecetasByFilters(buildRecetaFilter({ section, name }));

    const titulo = section && section !== 'todas'
      ? `Sección: ${section.charAt(0).toUpperCase() + section.slice(1)}`
      : name
        ? `Resultados para: ${name}`
        : 'Todas las recetas';

    res.render('recetas', {
      recetas,
      titulo,
      seccionActiva: section && section !== 'todas' ? section : 'todas',
      filtros: { section, name }
    });
  } catch (error) {
    console.error('Error al listar recetas:', error);
    res.status(500).send('Error interno del servidor');
  }
}

export async function listarPorSeccion(req, res) {
  return listarRecetas(req, res);
}

export async function mostrarFormularioCrear(req, res) {
  const colaboradores = await getAllColaboradores();
  res.render('form-receta', {
    titulo: 'Nueva Receta',
    subtitulo: 'Completa los campos para agregar una nueva receta al recetario.',
    accion: '/recetas/crear',
    botonTexto: 'Guardar Receta',
    esEdicion: false,
    colaboradores,
    receta: {
      name: '',
      description: '',
      link: '',
      img: '',
      ingredients: [],
      section: 'postres',
      collaboratorId: ''
    },
    error: null
  });
}

export async function crearRecetaController(req, res) {
  try {
    await createReceta(req.body);
    res.redirect('/recetas');
  } catch (error) {
    console.error('Error al crear receta:', error);
    const colaboradores = await getAllColaboradores();
    res.status(500).render('form-receta', {
      titulo: 'Nueva Receta',
      subtitulo: 'Completa los campos para agregar una nueva receta al recetario.',
      accion: '/recetas/crear',
      botonTexto: 'Guardar Receta',
      esEdicion: false,
      colaboradores,
      receta: req.body,
      error: 'Hubo un error al guardar la receta: ' + error.message
    });
  }
}

export async function mostrarFormularioEditar(req, res) {
  try {
    const { id } = req.params;
    const receta = await getRecetaById(id);
    if (!receta) {
      return res.status(404).render('recetas', {
        recetas: [],
        titulo: 'Receta no encontrada',
        seccionActiva: 'todas',
        mensaje: 'La receta solicitada no existe o fue eliminada.',
        filtros: { section: '', name: '' }
      });
    }

    const colaboradores = await getAllColaboradores();

    res.render('form-receta', {
      titulo: 'Editar Receta',
      subtitulo: `Modifica los datos de "${receta.name}"`,
      accion: `/recetas/editar/${receta._id}`,
      botonTexto: 'Guardar Cambios',
      esEdicion: true,
      receta,
      colaboradores,
      error: null
    });
  } catch (error) {
    console.error('Error al abrir formulario de edición:', error);
    res.status(500).send('Error al cargar la receta para editar.');
  }
}

export async function actualizarRecetaController(req, res) {
  try {
    const { id } = req.params;
    await updateReceta(id, req.body);
    res.redirect('/recetas');
  } catch (error) {
    console.error('Error al actualizar receta:', error);
    const colaboradores = await getAllColaboradores();
    res.status(500).render('form-receta', {
      titulo: 'Editar Receta',
      subtitulo: 'Modifica los datos de la receta',
      accion: `/recetas/editar/${req.params.id}`,
      botonTexto: 'Guardar Cambios',
      esEdicion: true,
      receta: { ...req.body, _id: req.params.id },
      colaboradores,
      error: 'Hubo un error al actualizar la receta: ' + error.message
    });
  }
}

export async function eliminarRecetaController(req, res) {
  try {
    const { id } = req.params;
    await deleteReceta(id);
    res.redirect('/recetas');
  } catch (error) {
    console.error('Error al eliminar receta:', error);
    res.status(500).send('Error al eliminar la receta.');
  }
}