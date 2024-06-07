const readline = require("node:readline");
const axios = require("axios");

const apiEndpoints = {
  searchBook: "https://ejditq67mwuzeuwrlp5fs3egwu0yhkjz.lambda-url.us-east-2.on.aws/api/books/search/",
  searchAuthor: "https://ejditq67mwuzeuwrlp5fs3egwu0yhkjz.lambda-url.us-east-2.on.aws/api/authors/",
};

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const searchAuthor = async (authorId) => {
  try {
    const { data } = await axios.get(apiEndpoints.searchAuthor + authorId);

    return `${data.firstName} ${data.middleName} ${data.lastName}`;
  } catch (error) {
    console.log("Author not found");
  }
};

const searchBook = async (title) => {
  try {
    const { data } = await axios.post(apiEndpoints.searchBook, {
      title,
    });

    const authors = await Promise.all(data.authors.map(async (authorId) => await searchAuthor(authorId)));

    return {
      title: data.title,
      description: data.description,
      authors: authors.join(", "),
    };
  } catch (error) {
    console.log("Book not found");
  }
};

const askBookTitle = () => {
  return readlineInterface.question("Enter book title: ", async (title) => {
    const book = await searchBook(title);

    if (book) {
      console.log(book);
      readlineInterface.close();
    } else {
      askBookTitle();
    }
  });
};

askBookTitle();
