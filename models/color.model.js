const { db } = require('../config/db');

const Color = {
  getAll: () => db('colors').select('*'),
  getById: (id) => db('colors').where({ id }).first(),
  create: (data) => db('colors').insert(data).returning('*'),
  update: (id, data) => db('colors').where({ id }).update(data).returning('*'),
  delete: (id) => db('colors').where({ id }).del()
};

module.exports = Color;
