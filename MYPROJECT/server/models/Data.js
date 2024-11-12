const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    amount: {type: String,required: true},
    purpose: {type: String,required:true},
    category:{type: String,required: true},
    date:{type: String,required: true}
});

const Data = mongoose.model('Data', dataSchema);
module.exports = Data;
