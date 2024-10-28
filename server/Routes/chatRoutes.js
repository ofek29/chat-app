const express = require('express');
const router = express.Router();

const chatController = require('../Controllers/chatController');

router.post('/', chatController.createChat);
router.get('/:userId', chatController.findUserChats);
router.get('/find/:firstId/:secondId', chatController.getChat);

module.exports = router;