const mongoose = require('../index.js');

const usedLicenseSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    staff: {
        type: String,
        required: true
    },
    usedAt: {
        type: Date,
        default: Date.now
    },
    used: {
        type: Boolean,
        default: true  
    }
});

const UsedLicense = mongoose.model('UsedLicense', usedLicenseSchema);

module.exports = UsedLicense;
