const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const usersController = require('../controllers/user-controller');

router.post('/', usersController.createUser);

router.get('/id/:id', auth, usersController.getUser);

router.put('/id/:id/update', auth, usersController.updateUser);

router.delete('/id/:id/delete', auth, usersController.deleteUser);

router.get('/userList', auth, usersController.getAllUsers);

// router.get('/email', usersController.email);

module.exports = router;
