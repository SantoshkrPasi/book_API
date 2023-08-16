const mongoose=require("mongoose");

// Creating a Publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

// create a Publication model

const PublicationModel=mongoose.model(PublicationSchema);

// Export
module.exports = PublicationModel;