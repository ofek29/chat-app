const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 3000;
const uri = process.env.MONGOOSE_URI;

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const userRoutes = require('./Routes/userRoutes');
app.use('/api/users', userRoutes);

const chatRoutes = require('./Routes/chatRoutes');
app.use('/api/chats', chatRoutes);

const messageRoutes = require('./Routes/messageRoutes');
app.use('/api/messages', messageRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

mongoose.connect(uri)
    .then(() => console.log("mongoose connected"))
    .catch(err => console.error("mongoose connection failed:", err));