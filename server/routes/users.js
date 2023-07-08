const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DateTime } = require("luxon");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Authentication

// POST Register User
router.post('/register', function(req, res, next){
  const email = req.body.email
  const password = req.body.password

  // Verify body
  if (!email||!password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return;
  }

  const queryUsers = req.db.from('users').select('*').where('email', '=', email)
  queryUsers
  .then((users) => {
    if (users.length > 0) {
      res.status(409).json({
        error: true,
        message: "User already exists"
      })
      return;
    }

    // Insert user into DB
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    return req.db.from('users').insert({ email, hash })
  })
  .then(() => {
    res.status(201).json({
      message: "User created"
    })
  })
})

// POST Login User
router.post('/login', function(req, res, next){
  const email = req.body.email
  const password = req.body.password

  // Verify body
  if (!email||!password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return;
  }

  const queryUsers = req.db.from('users').select('*').where('email', '=', email)
  queryUsers
  .then((users) => {
    if (users.length === 0) {
      throw Error("User does not exist")
    }
    const user = users[0]
    return bcrypt.compare(password, user.hash)
  })
  .then((match) => {
    if (!match) {
      throw Error("Incorrect password")
    }
    // Create and return JWT token
    const secretKey = 'secret key'
    const expires_in = 60 * 60 * 24 // 1 day
    const exp = Date.now() + (expires_in * 1000)
    const token = jwt.sign({email, exp}, secretKey)
    res.json({
      token: token,
      token_type: "Bearer",
      expires_in: expires_in
    })

  })
  .catch((err) => {
    res.status(401).json({"Error" : true, "message" : err.message})
  })

})

// Profile
let auth = false;
let userMatch = false;

const authorize = (req, res, next) => {
  const secretKey = 'secret key'
  const authorization = req.headers.authorization
  let token = null;

  if ((authorization!== undefined) && (authorization.split(" ")[0] !== 'Bearer')){
    auth = false;
    res.status(401).json({
      error: true,
      message: "Authorization header is malformed"
    })
    return;
  }

  //Retrieve token
  if (authorization && authorization.split(" ").length == 2) {
    token = authorization.split(" ")[1]
    auth = true;
    userMatch = true;
  } else {
    auth = false;
    next()
    return;
  }
  // Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, secretKey)
    if (decoded.email !== req.params.email){
      userMatch = false;
    }
    if (decoded.exp < Date.now()){
      auth = false;
      res.status(401).json({
        error: true,
        message: "JWT token has expired"
      })
      return;
    }

  next()
  } catch (e) {
    console.log(e)
    auth = false;
    res.status(401).json({
      error: true,
      message: "Invalid JWT token"
    })
  }
}

// GET User/{email}/profile
router.get('/:email/profile', authorize, function(req, res, next){
  const queryUsers = req.db.from('users').select('*').where('email', '=', req.params.email)

  queryUsers
  .then((rows) => {
    if (rows.length === 0) {
      throw Error("User does not exist")
    }
    if ((auth === true) && (userMatch === true)){
    rows.map(item => 
      res.json({
        "email": item.email,
        "firstName": item.firstName,
        "lastName": item.lastName,
        "dob": item.dob,
        "address": item.address
      }))
    } else {
      rows.map(item => 
        res.json({
          "email": item.email,
          "firstName": item.firstName,
          "lastName": item.lastName
        }))
    }
  })  
  .catch((err) => {
    res.status(404).json({"error" : true, "message" : err.message})
  })
})

// PUT User/{email}/profile
router.put('/:email/profile', authorize, async function(req, res, next){
  const email = req.params.email
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const dob = req.body.dob
  const address = req.body.address

  // Verify body
  if (!firstName||!lastName||!dob||!address) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete: firstName, lastName, dob and address are required."
    })
    return;
  }
  if (auth === false){
    res.status(401).json({
      error: true,
      message: "Unauthorized"
    })
    return;
  }
  if (userMatch === false){
    res.status(403).json({
      error: true,
      message: "User does not match"
    })
    return;
  }

  if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof address !== 'string'){
    res.status(400).json({
      error: true,
      message: "Request body invalid: firstName, lastName and address must be strings only."
    })
    return;
  }
  const y = dob.split("-")[0]
  const m = dob.split("-")[1]
  const d = dob.split("-")[2]

  if (y.length !== 4 || m.length !== 2 || d.length !== 2){
      res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a real date in format YYYY-MM-DD."
    })
    return;
  }

  if (DateTime.fromISO(dob) > Date.now()){
    res.status(400).json({
    error: true,
    message: "Invalid input: dob must be a date in the past."
  })
  return;
  }
  if (DateTime.fromISO(dob).isValid === false){
      res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a real date in format YYYY-MM-DD."
    })
    return;
  }

  if (auth === true) {
    await req.db.from('users')
    .where('email', '=', email)
    .update({
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      address: address})
    req.db.from('users').select('*').where('email', '=', email)
    .then((rows) => {
      rows.map(item => 
        res.json({
          "email": item.email,
          "firstName": item.firstName,
          "lastName": item.lastName,
          "dob": item.dob,
          "address": item.address
        }))
    })
  } else {
    res.status(401).json({
      error: true,
      message: "Forbidden"
    })
    return;
  }
  

})

module.exports = router;
