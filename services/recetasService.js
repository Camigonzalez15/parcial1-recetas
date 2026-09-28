import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

export function buildRecetaFilter({ section, name } = {}) {
  const filter = {};
  const sectionValue = typeof section === 'string' ? section.trim().toLowerCase() : '';
  const nameValue = typeof name === 'string' ? name.trim() : '';

  if (sectionValue && sectionValue !== 'todas') {
    filter.section = sectionValue;
  }

  if (nameValue) {
    filter.name = { $regex: nameValue, $options: 'i' };
  }

  return filter;
}

export async function getAllRecetas() {
  const db = getDB();
  return await db.collection('Recetas').find().toArray();
}

export async function getRecetasByFilters(filters = {}) {
  const db = getDB();
  return await db.collection('Recetas').find(filters).toArray();
}

export async function getRecetasByColaborador(collaboratorId) {
  const db = getDB();

  if (!collaboratorId) {
    return [];
  }

  try {
    return await db.collection('Recetas').find({ collaboratorId: new ObjectId(collaboratorId) }).toArray();
  } catch (error) {
    console.error('ID de ObjectId inválido o error al buscar recetas por colaborador:', error.message);
    return [];
  }
}

export async function getRecetasBySection(section) {
  return await getRecetasByFilters(buildRecetaFilter({ section }));
}

export async function getRecetaById(id) {
  const db = getDB();
  try {
    return await db.collection('Recetas').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('ID de ObjectId inválido o error al buscar:', error.message);
    return null;
  }
}

function normalizarIngredientes(data) {
  const raw = data.ingredients !== undefined ? data.ingredients : data.technologies;
  if (Array.isArray(raw)) {
    return raw.map(i => String(i).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw.split(',').map(i => i.trim()).filter(Boolean);
  }
  return [];
}

export async function createReceta(data) {
  const db = getDB();
  const ingredients = normalizarIngredientes(data);

  const nuevaReceta = {
    name: data.name?.trim() || 'Sin título',
    description: data.description?.trim() || '',
    link: data.link?.trim() || '#',
    img: data.img?.trim() || 'https://picsum.photos/400/225',
    ingredients,
    section: (data.section || 'otras').toLowerCase().trim(),
    collaboratorId: data.collaboratorId ? new ObjectId(data.collaboratorId) : null,
  };

  return await db.collection('Recetas').insertOne(nuevaReceta);
}

export async function updateReceta(id, data) {
  const db = getDB();
  const ingredients = normalizarIngredientes(data);

  const camposActualizados = {
    name: data.name?.trim() || 'Sin título',
    description: data.description?.trim() || '',
    link: data.link?.trim() || '#',
    img: data.img?.trim() || 'https://picsum.photos/400/225',
    ingredients,
    section: (data.section || 'otras').toLowerCase().trim(),
    collaboratorId: data.collaboratorId ? new ObjectId(data.collaboratorId) : null,
  };

  return await db.collection('Recetas').updateOne(
    { _id: new ObjectId(id) },
    { $set: camposActualizados }
  );
}

export async function deleteReceta(id) {
  const db = getDB();
  return await db.collection('Recetas').deleteOne({ _id: new ObjectId(id) });
}