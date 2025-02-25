import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    members: Array,
}, {
    timestamps: true
});

const chatModel = mongoose.model('chat', chatSchema);

export default chatModel;