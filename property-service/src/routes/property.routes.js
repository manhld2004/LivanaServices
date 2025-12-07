const express = require('express');
const PropertyController = require('../controllers/property.controller');
const logger = require('../utils/logger'); // ★ Thêm dòng này
const router = express.Router();

router.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

router.get('/', PropertyController.getAll);
router.post('/', PropertyController.create);
router.get('/:id', PropertyController.getById);
router.put('/:id', PropertyController.update);
router.delete('/:id', PropertyController.remove);

module.exports = router;
