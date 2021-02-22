const express = require('express');
const router = express.Router();

const usersController = require('../controllers/user-controller');

router.post('/', usersController.createUser);

router.get('/id/:id', usersController.getUser);

router.put('/id/:id/update', usersController.updateUser);

router.delete('/id/:id/delete', usersController.deleteUser);

router.get('/userList', usersController.getAllUsers);

// router.get('/email', usersController.email);

module.exports = router;
