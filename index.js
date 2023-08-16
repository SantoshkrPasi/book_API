require("dotenv").config();
// Framework
const express = require("express");

const mongoose=require("mongoose");
// Database
const database = require("./databases/index");
const { Mongoose } = require("mongoose");

// Instance of express
const shapeAI = express();

// Configuration
shapeAI.use(express.json());

// Establish Database Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false, // This is still valid in Mongoose
  // useCreateIndex: true,   // This is still valid in Mongoose
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


/*
Route         / (root)
Description   get all books
Access        PUBLIC
Parameters    NONE
Methods       GET
*/

// Route to get all books
shapeAI.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route          /is 
Description    get specific books based on ISBN 
Access         PUBLIC
Parameters     isbn
Methods        GET
*/

shapeAI.get("/is/:isbn",(req,res)=>{
    const getSpecificBook=database.books.filter((book)=>
    book.ISBN===req.params.isbn);
    if(getSpecificBook.length===0)
    {
        return res.json({error:`No book found for the ISBN for ${req.params.isbn}`,});
    }
    // obj have key=book and Value=getSpecifiedBook
    return res.json({book:getSpecificBook});
    

});

/*
Route          /c 
Description    get specific books based on category 
Access         PUBLIC
Parameters     category
Methods        GET
*/

shapeAI.get("/c/:category",(req,res)=>{
  const getSpecificBooks=database.books.filter((book)=>
    book.category.includes(req.params.category)
    );
    if(getSpecificBooks.length===0)
    {
        return res.json({error:`No book found for the Category for ${req.params.category}`,});
    }
    // obj have key=book and Value=getSpecifiedBook
    return res.json({books:getSpecificBooks});
});

/*
Route          /authors/:authorId/books
Description    get books written by a specific author
Access         PUBLIC
Parameters     authorId
Methods        GET
*/

shapeAI.get("/authors/:authorId/books", (req, res) => {
  const authorId = parseInt(req.params.authorId);
  const booksByAuthor = database.books.filter((book) => book.authors.includes(authorId));

  if (booksByAuthor.length === 0) {
    return res.json({ error: `No books found for the author with ID ${authorId}` });
  }

  return res.json({ books: booksByAuthor });
});


/*
Route          /author 
Description    to get all authors
Access         PUBLIC
Parameters     NONE
Methods        GET
*/

shapeAI.get("/author",(req,res)=>{
 return res.json({authors:database.authors});
});

/*
Route          /author 
Description    get lists of authors based on Book's ISBN
Access         PUBLIC
Parameters     isbn
Methods        GET
*/

shapeAI.get("/author/:isbn",(req,res)=>{
 const getSpecificauthors=database.authors.filter((author)=>
  author.books.includes(req.params.isbn)
 );
 if(getSpecificauthors.length===0)
 {
  return res.json({error:`No author found for the book ${req.params.isbn}`,});
 }
 return res.json({authors:getSpecificauthors});
});

/*
Route          /publication
Description    To get all publications
Access         PUBLIC
Parameters     NONE
Methods        GET
*/

shapeAI.get("/publications",(req,res)=>{
return res.json({publications:database.publications});
});

/*
Route          /book/new
Description    To add new book
Access         PUBLIC
Parameters     NONE
Methods        POST
*/
shapeAI.post("/book/new", (req, res) => {
  const { newBook } = req.body; // Use lowercase for variable names
  database.books.push(newBook); // Push an object with the new book data
  return res.json({ books:database.books,message: "Book added successfully" }); // Send a response
});

/*
Route          /author/new
Description    To add new author
Access         PUBLIC
Parameters     NONE
Methods        POST
*/
shapeAI.post("/author/new", (req, res) => {
  const { newAuthor } = req.body; // Use lowercase for variable names
  database.authors.push(newAuthor); // Push an object with the new author data
  return res.json({ authors:database.authors,message: "Author Added Successfully" }); // Send a response
});

/*
Route          /publication/new
Description    To add new publication
Access         PUBLIC
Parameters     NONE
Methods        POST
*/
shapeAI.post("/publication/new", (req, res) => {
  const { newPublication } = req.body; // Use lowercase for variable names
  database.publications.push(newPublication); // Push an object with the new publication data
  return res.json({ publications:database.publications,message: "Publications Added Successfully" }); // Send a response
});

/*
Route          /book/update/
Description    To update title
Access         PUBLIC
Parameters     :isbn
Methods        PUT
*/
shapeAI.put("/book/update/:isbn",(req,res)=>{
  database.books.forEach((book)=>{
    if(book.ISBN==req.params.isbn)
    {
      book.title=req.body.bookTitle;
      return;
    }
  });
  return res.json({books:database.books});
});

/*
Route          /book/author/update/
Description    To update/add new author
Access         PUBLIC
Parameters     :isbn
Methods        PUT
*/

shapeAI.put("/book/author/update/:isbn",(req,res)=>{
  // update book database
   database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn)
    return book.authors.push(req.body.newAuthor);
   });
  // update author database
  database.authors.forEach((author)=>{
    if(author.id===req.body.newAuthor)
    return author.books.push(req.params.isbn);
  });
  return res.json({books:database.books,authors:database.authors,message:"New Author was Added",});
});

/*
Route          /publication/update/book/
Description    update/add new book to a publication
Access         PUBLIC
Parameters     :isbn
Methods        PUT
*/

shapeAI.put("/publication/update/book/:isbn",(req,res)=>{
  // update the publication database
  database.publications.forEach((publication)=>{
    if(publication.id===req.body.pubID)
    {
      return publication.books.push(req.params.isbn);
    }
  });
  // update the book database replace the publication in books database
  database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn)
    {
      book.publication=req.body.pubID;
      return;
    }
  });
  return res.json({books:database.books,publications:database.publications,
  message:"Successfully Updated Publication",});
});

/*
Route          /book/delete
Description    to delete a book
Access         PUBLIC
Parameters     :isbn
Methods        DELETE
*/
// it will not work as book is const in database so change it to let to get modify
shapeAI.delete("/book/delete/:isbn",(req,res)=>{
  const updatedBookDatabase = database.books.filter((book) => {
    return book.ISBN !== req.params.isbn;
  });

  database.books = updatedBookDatabase;
  return res.json({ message: "Book deleted successfully", books: database.books });
});

/*
Route          /book/delete/author
Description    delete a author from a book
Access         PUBLIC
Parameters     :isbn , author id
Methods        DELETE
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
  // update the Book Database
  database.books.forEach((book)=>{
   if(book.ISBN===req.params.isbn)
   {
    const newAuthorList=book.authors.filter(
      (author)=>author!==parseInt(req.params.authorId)
    );
    book.authors=newAuthorList;
    return;
   }
  });

  //  update author database
  database.authors.forEach((author)=>{
    if(author.id===parseInt(req.params.authorId))
    {
      const newBookList=author.books.filter(
        (book)=>book!==req.params.isbn);
        author.books=newBookList;
        return;
    }   
  });
  return res.json({
    message:"Author was deleted",
    book:database.books,
    author:database.authors
  });
});

/*
Route          /publication/delete/book
Description    delete a book from publication
Access         PUBLIC
Parameters     :isbn , publication id
Methods        DELETE
*/

shapeAI.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{
  //  update publication database
  database.publications.forEach((publication)=>{
    if(publication.id===parseInt(req.params.pubId)){
      const newBookList=publication.books.filter((book)=>
      book!==req.params.isbn);
      publication.books=newBookList;
      return;
    }
  });

  // update book database
  database.books.forEach((book)=>{
  if(book.ISBN===req.params.isbn){
    book.publication=0;
    return;
  }
  });
  return res.json({books:database.books,publications:database.publications});
});

// Start the server and listen on port 3000

shapeAI.listen(3000, () => console.log("Server is running!!!!"));

// Talk to mongoDB in which they understand=> *****
// Talk to us in which we understand =>javascript

// then comes Mongoose