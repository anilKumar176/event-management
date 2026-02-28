const mongoose = require('mongoose');

const requestItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    category: String,
    description: String,
    preferredVendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'fulfilled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RequestItem', requestItemSchema);
