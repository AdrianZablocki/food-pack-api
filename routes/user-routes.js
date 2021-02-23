const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const usersController = require('../controllers/user-controller');

router.post('/', usersController.createUser);

router.get('/userList', auth, usersController.getAllUsers);

router.get('/:id', auth, usersController.getUser);

router.put('/:id', auth, usersController.updateUser);

router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;
