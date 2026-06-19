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
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password =  req.body.password;

  if (!username || !password) {
    return res.status(404).json({message:"Username and password are requried!"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(404).json({message:"Invalid username or password"});
  }

  let accessToken = jwt.sign({username}, "access", {expiresIn: "1h"});

  req.session.authorization = {accessToken, username};

  return res.status(200).json({message:"Customer sucessfully logged in", accessToken});
});

// Check registered users
regd_users.get("/users", (req, res) => {
    return res.status(200).json(users);
})
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
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

  return res.status(200).json({message:"Review successfully added", reviews: books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
