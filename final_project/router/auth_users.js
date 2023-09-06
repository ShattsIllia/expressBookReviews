const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  if(authenticatedUser) {
    const ISBN = req.params.isbn;
    const review = req.params.review;
    const arrayBooks = Object.values(books);
    const filteredByIsbnBook = arrayBooks.filter((book) => book.ISBN === ISBN);
    filteredByIsbnBook[0].reviews = review;
    res.status(200).send("Review successfully added");
  } else {
    res.status(400).send("You need to be log in to add review");
  }
 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(authenticatedUser) {
      const ISBN = req.params.isbn;
      const review = req.params.review;
      const arrayBooks = Object.values(books);
      const filteredByIsbnBook = arrayBooks.filter((book) => book.ISBN != ISBN);
      filteredByIsbnBook[0].reviews = review;
      res.status(200).send("Review successfully Deleted");
    } else {
      res.status(400).send("You need to be log in to delete review");
    }
});

regd_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;