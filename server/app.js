const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const uri = process.env.MONGOOSE_URI;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const userRoutes = require('./Routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

mongoose.connect(uri)
    .then(() => console.log("mongoose connected"))
    .catch(err => console.error("mongoose connection failed:", err));