const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Size = {
  getAll: () => db('sizes').select('*'), // Get all sizes
  getById: (id) => db('sizes').where({ id }).first(), // Get a specific size by ID
  create: (data) => db('sizes').insert(data).returning('*'), // Create a new size
  createMultiple: (data) => {
    const sizesWithIds = data.map(size => ({
      id: uuidv4(),
      label: size.label,
      gender: size.gender,
      chest: size.chest,
      waist: size.waist,
      hips: size.hips,
      description: size.description,
    }));
    return db('sizes').insert(sizesWithIds).returning('*');
  },
  update: (id, data) => db('sizes').where({ id }).update(data).returning('*'), // Update an existing size
  delete: (id) => db('sizes').where({ id }).del(), // Delete a size
};

module.exports = Size;
