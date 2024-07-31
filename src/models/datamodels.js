const mongoose = require('mongoose');
//schema for storing data in mongodb
const UploadSchema = new mongoose.Schema({
    filename: {
        type: String
    },
    originalname: {
        type: String
    },
    path: {
        type: String
    },
    size: {
        type: Number
    }
})

const Upload = mongoose.model('csvUpload', UploadSchema);

module.exports = Upload;