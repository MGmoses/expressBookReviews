const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(404).json({message: "Invalid username or password"});
  }

  let accessToken = jwt.sign({username}, "access", {expiresIn: "1h"});

  req.session.authorization = {accessToken, username};

  return res.status(200).json({message: "User successfully logged in as an old user"});
});

// Check registered users
regd_users.get("/users", (req, res) => {
    return res.status(200).json(users);
})
// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if(!review) {
    return res.status(404).json({message:"Review is required"});
  }

  if(!books[isbn]) {
    return res.status(404).json({message:"Book not found"});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({message:"Review successfully added/modified", reviews: books[isbn].reviews});
});

// Delete Book Review
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "Review not found"});
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({message: "Review successfully deleted", reviews: books[isbn].reviews});
 });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
