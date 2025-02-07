import express from 'express';
const router = express.Router();

import { createMessage, getMessages } from '../Controllers/messageController.js';

router.post('/', createMessage);
router.get('/:chatId', getMessages);

export default router;