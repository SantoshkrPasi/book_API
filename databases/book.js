const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubdate: String,
    numofpage: Number,
    category: [String],
    publication: Number,
});

// create a book model

const BookModel=mongoose.model(BookSchema);

// Export
module.exports=BookModel;