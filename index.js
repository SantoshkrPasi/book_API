require("dotenv").config();

// Framework
const express = require("express");
const mongoose=require("mongoose");

// // Database
// const database = require("./databases/index");

// // Models
// const BookModels = require("./databases/book");
// const AuthorModels = require("./databases/author"); 
// const PublicationModels = require("./databases/publication"); 

// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// const { Mongoose } = require("mongoose");

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

// Initializing Microservices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);


/*
Route         / (root)
Description   get all books
Access        PUBLIC
Parameters    NONE
Methods       GET
*/

// Route to get all books
shapeAI.get("/", async(req, res) => {
  const getAllBooks = await BookModels.find();
  return res.json(getAllBooks);
});

/*
Route          /is 
Description    get specific books based on ISBN 
Access         PUBLIC
Parameters     isbn
Methods        GET
*/

shapeAI.get("/is/:isbn",async (req,res)=>{
      //  With mongoose
    const getSpecificBook = await BookModels.findOne({ISBN:req.params.isbn});

    // WITHOUT MONGOOSE
    // const getSpecificBook=database.books.filter((book)=>
    // book.ISBN===req.params.isbn);

      // NULL -> false (so make it true to enter in if condition)
      // true will be converted as false and it will not enter in the if condition and else will be executed

    if(!getSpecificBook)
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

shapeAI.get("/c/:category",async (req,res)=>{
  // with Mongoose
  const getSpecificBooks = await BookModels.findOne({category:req.params.category,});
  // Without moongoose
  // const getSpecificBooks=database.books.filter((book)=>
  //   book.category.includes(req.params.category)
  //   );

    if(!getSpecificBooks)
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

shapeAI.get("/author",async (req,res)=>{
  const getAllAuthors= await AuthorModels.find(); //one line for mongo DB
 return res.json({authors:database.authors});    //database.authors with getAllAuthors
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
shapeAI.post("/book/new", async (req, res) => {
  const { newBook } = req.body; // Use lowercase for variable names

  const addNewBook = BookModels.create(newBook);
  return res.json({message: "Book added successfully" }); // Send a response

  // Without Mongoose
  // database.books.push(newBook); // Push an object with the new book data
  // return res.json({ books:database.books,message: "Book added successfully" }); // Send a response
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
  AuthorModels.create(newAuthor);
  // withoutMongoDb
  // database.authors.push(newAuthor); // Push an object with the new author data
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
shapeAI.put("/book/update/:isbn", async (req,res)=>{

   const updatedBook = await BookModels.findOneAndUpdate(
    {
      ISBN : req.params.isbn,
    },
    {
     title : req.body.bookTitle,
    },
    {
      new : true,  //if not given true it will update but not shows the updated data
    }
   );
   return res.json({ books : updatedBook });
  // Without Mongoose
  // database.books.forEach((book)=>{
  //   if(book.ISBN==req.params.isbn)
  //   {
  //     book.title=req.body.bookTitle;
  //     return;
  //   }
  // });
  // return res.json({books:database.books});
});

/*
Route          /book/author/update/
Description    To update/add new author
Access         PUBLIC
Parameters     :isbn
Methods        PUT
*/

shapeAI.put("/book/author/update/:isbn", async (req,res)=>{

  // update the book database
  const updatedBook = await BookModels.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $push: {
        authors: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

// update author database
const updatedAuthor = await AuthorModels.findOneAndUpdate(
  {
   id: req.body.newAuthor,
  },
  {
    $addToSet: {
      books: req.params.isbn,
    },
  },
  {
    new: true,
  }
);

return res.json({ books : updatedBook,
                authors : updatedAuthor,
                message : "New Author was Added",});

    //  Without Mongoose
  // update book database 
  //  database.books.forEach((book)=>{
  //   if(book.ISBN===req.params.isbn)
  //   return book.authors.push(req.body.newAuthor);
  //  });
  // // update author database
  // database.authors.forEach((author)=>{
  //   if(author.id===req.body.newAuthor)
  //   return author.books.push(req.params.isbn);
  // });
  // return res.json({books:database.books,authors:database.authors,message:"New Author was Added",});
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