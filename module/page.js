const mongoose = require('mongoose');
const page =  new mongoose.Schema({
    page: String,
    data: Object,
    date: {type: Date, default: Date.now}
});

module.exports =  mongoose.model('page',page);