const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiarySchema = new Schema({
    title:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    entry:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    }
});

mongoose.model('diary', DiarySchema);

