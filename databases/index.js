const books = [
    {
      ISBN: "12345ONE",
      title: "Getting started with MERN",
      authors: [1,2],
      language: "en",
      pubdate: "2023-08-5",
      numofpage: 225,
      category: ["fiction", "programming", "tech", "web dev"],
      publication: 1,
    },
    {
        ISBN: "12345TWO",
        title: "Getting started with PYTHON",
        authors: [1,2],
        language: "en",
        pubdate: "2023-08-5",
        numofpage: 225,
        category: ["fiction", "tech", "web dev"],
        publication: 1,
      },
  ];
  
  const authors = [
    {
      id: 1,
      name: "Santosh",
      books: ["12345ONE","12345TWO"],
    },
    {
      id: 2,
      name: "Siddhart",
      books: ["12345ONE"],
    },
  ];
  
  const publications = [
    {
      id: 1,
      name: "Chakra",
      books: ["12345ONE"],
    },
  ];

  module.exports={books,authors,publications};
  