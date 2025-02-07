import express from 'express';
const router = express.Router();

import { registerUser, loginUser, findUser, getAllUsers, deleteUser } from '../Controllers/userController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/find/:userId', findUser);
router.get('/', getAllUsers);
router.get('/delete/:userId', deleteUser);

export default router;