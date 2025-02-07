import chatModel from '../Models/chatModel.js';

export const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;
    // check if we already have this users
    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        })
        if (chat) {
            return res.status(200).json(chat);
        }

        const newChat = new chatModel({
            members: [firstId, secondId]
        })

        const response = await newChat.save();
        res.status(200).json(response);

    } catch (error) {
        console.log('Error creating chat', error)
        res.status(500).json(error)
        // res.status(500).json({ error: error })
    }
};

export const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] },
        });
        res.status(200).json(chats);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const getChat = async (req, res) => {
    const { firstId, secondId } = req.params;
    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        });
        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};