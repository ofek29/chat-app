const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const uri = process.env.MONGOOSE_URI;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

mongoose.connect(uri)
    .then(() => console.log("mongoose connected"))
    .catch(err => console.error("mongoose connection failed:", err));