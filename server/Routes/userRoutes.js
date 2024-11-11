const express = require('express');
const router = express.Router();

const userController = require('../Controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/find/:userId', userController.findUser);
router.get('/', userController.getAllUsers);
router.get('/delete/:userId', userController.deleteUser);

module.exports = router;