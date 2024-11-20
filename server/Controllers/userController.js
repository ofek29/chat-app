const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userModel = require('../Models/userModel');
const messageModel = require('../Models/messageModel');
const chatModel = require('../Models/chatModel');

//crate token for user authentication
const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtKey, { expiresIn: '5h' });
}

//register user and save to db
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json('All fields are required');
        }

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json('User already exists');
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json('Invalid email');
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json
                ('passwords must be at least 8 characters and contain 1 uppercase, lowercase, number and symbol');
        }

        user = new userModel({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name, email, token });
    } catch (err) {
        console.log('register error')
        res.status(500).send(err);
    }
};
module.exports.registerUser = registerUser;

//login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json('All fields are required');
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json('Invalid email or password');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json('Invalid email or password');
        }

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (err) {
        console.log('Login error')
        res.status(500).send(err);
    }
};
module.exports.loginUser = loginUser;

//get user by id
const findUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json('User not found');
        }

        res.status(200).json(user);
    } catch (err) {
        console.log('Error getting user')
        res.status(500).send(err);
    }
};
module.exports.findUser = findUser;

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (err) {
        console.log('Error getting all users')
        res.status(500).send(err);
    }
};
module.exports.getAllUsers = getAllUsers;

//delete user and his messages from the database
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(400).json('User not found');
        }

        //find and delete all messages connected to chat of a user
        const userChats = await chatModel.find({ members: { $in: [userId] } });
        const userChatsIds = userChats.map(chat => chat._id);
        userChatsIds.forEach(async (chatId) => {
            await messageModel.deleteMany({ chatId: chatId });
        });
        //delete all chats of a user
        await chatModel.deleteMany({ members: { $in: [userId] } });

        res.status(200).json(user);
    } catch (err) {
        console.log('Error deleting user')
        res.status(500).send(err);
    }
};
module.exports.deleteUser = deleteUser;