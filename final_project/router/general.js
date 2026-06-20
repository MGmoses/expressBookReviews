const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are requried!"});
  }

  if (users.some(user => user.username === username)) {
    return res.status(404).json({message: "Username already exists!"});
  }

  users.push({username: username, password: password});
  return res.send(200).json({message: "User successfully registered. Now you can log in!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((books) => {
    return res.status(200).json(JSON.stringify(books, null, 4));
  })
  .catch((err) => {
    return res.status(500).json({message: "Error fetching books"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  })
  .then((book) => {
    return res.status(200).json(JSON.stringify(book, null, 4));
  })
  .catch((err) => {
    return res.status(404).json({message: err});
  });
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const matchingBooks = Object.keys(books)
    .filter(isbn => books[isbn].author === author)
    .map(isbn => books[isbn]);

    if (matchingBooks.length > 0) {
        resolve(matchingBooks);
    } else {
        reject("No books found for this author");
    }
  })
  .then((matchingBooks) => {
    return res.status(200).json(JSON.stringify(matchingBooks, null, 4));
  })
  .catch((err) => {
    return res.status(404).json({message: err});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = Object.keys(books)
  .filter(isbn => books[isbn].title === title)
  .map(isbn => books[isbn]);
  return res.send(JSON.stringify(matchingBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  });
  
module.exports.general = public_users;
