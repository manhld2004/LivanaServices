const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

router.post('/', UserController.createUser);
router.get('/:id', UserController.getUser);
router.put('/:id/avatar', UserController.updateAvatar);

module.exports = router;
