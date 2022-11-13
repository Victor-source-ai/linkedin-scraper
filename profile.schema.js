const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Profile", ProfileSchema);
