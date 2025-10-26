const PropertyService = require('../services/property.service');

const PropertyController = {
  async getAll(req, res) {
    try {
      const result = await PropertyService.getAllProperties();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const result = await PropertyService.createProperty(req.body);
      res.json({ ...result, message: 'Property created successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const result = await PropertyService.getPropertyById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const result = await PropertyService.updateProperty(req.params.id, req.body);
      res.json({ ...result, message: 'Property updated successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await PropertyService.deleteProperty(req.params.id);
      res.json({ ...result, message: 'Property deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = PropertyController;
