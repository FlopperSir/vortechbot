const mongoose = require('../index.js');

const licenseSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
});

const License = mongoose.model('License', licenseSchema);

module.exports = License;
