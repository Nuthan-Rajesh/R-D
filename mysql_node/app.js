const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const app = express();

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

db.connect((err)=> {
    if(err) {
        console.log("ERROR CONNECTING");
    }
    else {
      console.log("Connected"); 
      db.query("CREATE DATABASE IF NOT EXISTS xelpmoc", (err,result) => {
        if(!err) {
          console.log("Database Created if not exists");
        }
      });
      db.query("use xelpmoc", (err,result) => {
        if(!err) {
          console.log("Database xelpmoc");
          const sql = "CREATE TABLE IF NOT EXISTS users(id INT(10) NOT NULL AUTO_INCREMENT,name VARCHAR(25) NOT NULL,email VARCHAR(25) NOT NULL, password VARCHAR(255) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id));"
          db.query(sql, (err, result) => {
            if (!err) {
              console.log("created table if not exists")
            }
          });
        }
      });
    }
});

app.use(express.json());


app.post('/user/signup', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const sql = `INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)`;
  
  function checkEmail(email, callback){
    db.query('SELECT * FROM users WHERE email = ?',[email], (err, result)=>{
      if(err){
        console.log(err);
      }
      if(result.length>0){
        console.log("user email already exists");
        res.status(201).json({ message: 'User email Already exists' });
        // console.log(typeof result);
        callback(true);
      }else{
        callback(false);
      }
    });
  }

  function checkName(email, callback){
    db.query('SELECT * FROM users WHERE name = ?',[name], (err, result)=>{
      if(err){
        console.log(err);
      }
      if(result.length>0){
        console.log("user name already exists");
        res.status(201).json({ message: 'User name Already exists' });
        // console.log(typeof result);
        callback(true);
      }else{
        callback(false);
      }
    });
  }


  checkEmail(email, function(result) {
    if(result!=0){
      console.log('email exist');
    }
    // console.log(`email exist ${result}`)
  });

  checkName(name, function(result) {
    if(result!=0){
      console.log("NAME EXIST")
    }
    // console.log(`name exist ${result}`)
  })

  db.query('SELECT * FROM users WHERE email = ? OR name = ?',[email, name], (err, result)=>{
    if(err){
      console.log(err);
    }
    if(result.length!=0){
      console.log("user already exists");
      // res.status(201).json({ message: 'User Already exists' });
      // console.log(typeof result);
    }
    else{
      db.query(sql, [name, email, hashedPassword, new Date()], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          res.status(201).json({ message: 'User created successfully' });
        }
      });
    }
  })
})

app.post('/user/login',(req,res) => {
  const { emailorusername, password } = req.body;
  // console.log(email,password);
  const isEmail = emailorusername.includes('@');
  // console.log(isEmail);
  if(isEmail){
    db.query('SELECT * FROM users WHERE email = ?',emailorusername, (err, result)=>{
      if(err){
        console.log(err);
      }
      if(result.length != 0){
        const user = result[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(isPasswordValid){
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
          res.status(200).json({ token, result });
        } else {
          res.status(401).json({ message: 'Email or password is incorrect' });
        }
      } else {
        console.log("provide correct email and password");
        res.status(201).json({ message: 'provide correct email and password' });
      }
    });
  } else {
    db.query('SELECT * FROM users WHERE name = ?',emailorusername, (err, result)=>{
      if(err){
        console.log(err);
      }
      if(result.length != 0){
        const user = result[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(isPasswordValid){
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {expiresIn: 3});
          res.status(200).json({ token, result });
        } else {
          res.status(401).json({ message: 'name or password is incorrect' });
        }
      } else {
        console.log("provide correct name and password");
        res.status(201).json({ message: 'provide correct name and password' });
      }
    });
  }
});

const verifyToken = (req,res,next) => {
  const token = req.header("x-access-token");
  // console.log(token)
  if(typeof token != undefined) {
    // console.log(token);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
      if(err) {
        res.sendStatus(403);
        console.log(err);
      } else {
        req.result = result;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

app.post('/data', verifyToken, (req, res) => {
  const {data} = req.body;
  console.log(req.result);
  const userId = req.result.id;
  const sql = `INSERT INTO data (userid, data) VALUES (${userId}, '${data}');`;
  db.query(sql, (err, result) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(result);
      res.sendStatus(200);
    }
  })
});

app.get('/user/data',verifyToken, (req,res) => {
  const { id } = req.params;
  // console.log(id);
  console.log(req.result);
  const userId = req.result.id;
  const sql = `SELECT * FROM data WHERE userid = ${userId} ;`;
  db.query(sql, (err, result) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(result);
      res.status(200).json({result})
      // res.sendStatus(200);
    }
  });
})

app.listen(8000, () => {
    console.log("server running on 8000");
});
