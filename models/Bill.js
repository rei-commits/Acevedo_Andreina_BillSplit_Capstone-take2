const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    tip: { type: Number, required: true },
    splitBetween: { type: Number, required: true },
    total: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now }
});

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
