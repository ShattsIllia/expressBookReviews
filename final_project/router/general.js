const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
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

public_users.get('/',function (req, res) {
    let getBookPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            return  res.send(JSON.stringify({books},null,4));
        },5000)
    })
});

public_users.get('/isbn/:isbn',function (req, res) {
  let getDetailksPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        const ISBN = req.params.isbn;
        const arrayBooks = Object.values(books);
        const filteredByIsbnBook = arrayBooks.filter((book) => book.ISBN === ISBN);
        res.send(JSON.stringify({filteredByIsbnBook},null,4));
    }, 3000)
  })
 });
  
public_users.get('/author/:author',function (req, res) {
    let getDetailsPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            const author = req.params.author;
            const arrayBooks = Object.values(books);
            const filteredByAuthor = arrayBooks.filter((book) => book.author.toLowerCase() === author.toLowerCase());
            res.send(JSON.stringify({filteredByAuthor},null,4));
        },2000) 
    })
});

public_users.get('/title/:title',function (req, res) {
    let getBookByTitlePromise = new Promise((resolve,reject) => { 
        setTimeout(() => {
            const title = req.params.title;
            const arrayBooks = Object.values(books);
            const filteredByTitle = arrayBooks.filter((book) => book.title.toLowerCase() === title.toLowerCase());
            res.send(JSON.stringify({filteredByTitle},null,4));
        },2000)
    })
});

public_users.get('/review/:isbn',function (req, res) {
 const ISBN = req.params.isbn;
 const arrayBooks = Object.values(books);
 const filteredByIsbnBook = arrayBooks.filter((book) => book.ISBN === ISBN);
 res.send(JSON.stringify(filteredByIsbnBook[0].reviews,null,4));
});

module.exports.general = public_users;
