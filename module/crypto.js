const mongoose = require('mongoose');
const Crypto =  new mongoose.Schema({
    coinName: String,
    date: {type: Date, default: Date.now},
    name: String,
    amount: Number,
    quantity: Number,
    transactionType: String
});

module.exports =  mongoose.model('Crypto',Crypto);