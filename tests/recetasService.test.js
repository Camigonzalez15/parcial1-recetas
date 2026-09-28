import test from 'node:test';
import assert from 'node:assert/strict';

import { buildRecetaFilter } from '../services/recetasService.js';

test('buildRecetaFilter combina section y name en un mismo filtro', () => {
  const filter = buildRecetaFilter({
    section: 'postres',
    name: 'Tarta'
  });

  assert.deepEqual(filter, {
    section: 'postres',
    name: { $regex: 'Tarta', $options: 'i' }
  });
});
