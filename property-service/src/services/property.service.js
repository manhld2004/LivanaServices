const PropertyRepository = require('../repositories/property.repository');

const PropertyService = {
  async getAllProperties() {
    return await PropertyRepository.getAll();
  },

  async createProperty(data) {
    if (!data.name || !data.city) {
      throw new Error('Property must have name and city');
    }
    return await PropertyRepository.create(data);
  },

  async getPropertyById(id) {
    const prop = await PropertyRepository.getById(id);
    if (!prop) throw new Error('Property not found');
    return prop;
  },

  async updateProperty(id, data) {
    return await PropertyRepository.update(id, data);
  },

  async deleteProperty(id) {
    return await PropertyRepository.delete(id);
  }
};

module.exports = PropertyService;
