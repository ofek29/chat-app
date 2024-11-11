const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');

const port = process.env.PORT || 3000;
const uri = process.env.MONGOOSE_URI;

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

mongoose.connect(uri)
    .then(() => console.log("mongoose connected"))
    .catch(err => console.error("mongoose connection failed:", err));