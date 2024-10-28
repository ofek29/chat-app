const messageModel = require('../Models/messageModel');

const createMessage = async (req,res)=> {
    const {chatId, senderId, content} = req.body;
    //todo check params 
    try {
        const message = new messageModel({
            chatId,
            senderId,
            content
        });

        const response = await message.save();
        res.status(200).json(response);

    } catch (error) {
        console.log('Error creating message')
        res.status(500).json(error)
    }
};
module.exports.createMessage = createMessage;


const getMessages = async (req,res)=> {
    const {chatId} = req.params;
    try {
        const messages = await messageModel.find({chatId});
        
        if(messages.length <= 0) {
            return res.status(400).json('No messages found');
        }
        res.status(200).json(messages);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
module.exports.getMessages = getMessages;