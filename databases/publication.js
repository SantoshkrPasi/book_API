const mongoose=require("mongoose");
const { publications } = require(".");

// Creating a Publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

// create a Publication model

const PublicationModel=mongoose.model("publications",PublicationSchema);

// Export
module.exports = PublicationModel;