const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');

router.post('/login', authController.authUser);

router.post('/refresh', authController.refreshToken);

module.exports = router;
