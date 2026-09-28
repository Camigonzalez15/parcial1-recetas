import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

export async function getAllColaboradores() {
  const db = getDB();
  return await db.collection('Colaboradores').find().toArray();
}

export async function getColaboradorById(id) {
  const db = getDB();
  try {
    return await db.collection('Colaboradores').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('ID de ObjectId inválido o error al buscar colaborador:', error.message);
    return null;
  }
}

export async function createColaborador(data = {}) {
  const db = getDB();
  const name = typeof data.name === 'string' ? data.name.trim() : '';

  if (!name) {
    throw new Error('El campo "name" es obligatorio');
  }

  const nuevoColaborador = {
    name,
    photo: typeof data.photo === 'string' ? data.photo.trim() : '',
    description: typeof data.description === 'string' ? data.description.trim() : ''
  };

  return await db.collection('Colaboradores').insertOne(nuevoColaborador);
}
