const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Color = {
  getAll: () => db('colors').select('*'),
  getById: (id) => db('colors').where({ id }).first(),
  create: (data) => db('colors').insert(data).returning('*'),
  createMultiple: (data) => {
    const colorsWithIds = data.map((color) => ({
      id: uuidv4(),
      name: color.name,
      hex: color.hex || '#000000', // Default to black if `hex` is missing
    }));

    return db('colors').insert(colorsWithIds).returning('*');
  },
  update: (id, data) => db('colors').where({ id }).update(data).returning('*'),
  delete: (id) => db('colors').where({ id }).del()
};

module.exports = Color;
