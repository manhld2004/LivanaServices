const express = require('express');
const PropertyController = require('../controllers/property.controller');
const router = express.Router();

router.get('/', PropertyController.getAll);
router.post('/', PropertyController.create);
router.get('/:id', PropertyController.getById);
router.put('/:id', PropertyController.update);
router.delete('/:id', PropertyController.remove);

module.exports = router;
