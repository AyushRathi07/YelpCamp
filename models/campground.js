var mongoose = require("mongoose");

var cgSchema = new mongoose.Schema({
    title: String,
    image: String,
    desc: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground",cgSchema);