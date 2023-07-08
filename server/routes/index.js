const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Administration
router.get('/me', function(req, res, next) {
  res.json({name: "Harrison Leach", student_number: "n11039639"});
});

// Data

// GET country
router.get("/countries", function(req,res, next) {
  req.db.from('data').distinct().select("country").orderBy("country", "asc")
  .then((rows) => {
    count = Object.keys(req.query).length
    if (count > 0){
      throw Error('Invalid query parameters. Query parameters are not permitted.')
    }
    res.status(200).send(rows.map(item => item.country))
  })
  .catch((err) => {
  res.json({"error" : true, "message" : err.message})
  })
 });

 // GET volcanoes in country
 router.get('/volcanoes', function(req,res,next) {
  let query = req.db.from('data').select('id', 'name', 'country', 'region', 'subregion').where('country','=', req.query.country)

  count = Object.keys(req.query).length
  if (count === 0){
    res.status(400).json({"error" : true, "message" : "Country is a required Query Parameter."})
    return;
  }
  if ((req.query.populatedWithin !== undefined)&&(
    (req.query.populatedWithin === '5km')||
    (req.query.populatedWithin === '10km')||
    (req.query.populatedWithin === '30km')||
    (req.query.populatedWithin === '100km'))){
      const popRadius = req.query.populatedWithin
      query = req.db.from('data')
      .select('id', 'name', 'country', 'region', 'subregion')
      .where('country','=', req.query.country)
      .andWhere(`population_${popRadius}`,'>', '0')
    }

  query
  .then((rows) => {
    for (const x in req.query){
      if ((x !== 'country')&&(x !== 'populatedWithin')){
        throw Error('Invalid Query Parameters.')
      }
    }
    if ((req.query.populatedWithin !== undefined)&&(req.query.populatedWithin !== '5km')&&(req.query.populatedWithin !== '10km')&&(req.query.populatedWithin !== '30km')&&(req.query.populatedWithin !== '100km')){
      throw Error('Invalid populatedWithin query.')
    }
    
    res.status(200).send(rows)
  })
  .catch((err) => {
  res.status(400).json({"error" : true, "message" : err.message})
  })
 }); 

let auth = false;

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
  } else {
    auth = false;
    next()
    return;
  }
  // Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, secretKey)
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
    auth = false;
    res.status(401).json({
      error: true,
      message: "Invalid JWT token"
    })
  }
}
  // GET volcanoes in country
  router.get("/volcano/:id", authorize, function(req,res,next) {
    req.db.from('data').select('*').where('id','=', req.params.id)
    .then((rows) => {
      if (rows.length == 0) {
        res.status(404).json({
          error: true,
          message: `Volcano with ID: ${req.params.id} not found.`
        })
        return;
      }

      if (auth === true){
        rows.map(item => res.json(item))
      } else {
        rows.map(item => (
          res.json({
            "id": item.id,
            "name": item.name,
            "country": item.country,
            "region": item.region,
            "subregion": item.subregion,
            "last_eruption": item.last_eruption,
            "summit": item.summit,
            "elevation": item.elevation,
            "latitude": item.latitude,
            "longitude": item.longitude
          })
          ))
      }
    
    })
   }); 
 
module.exports = router;
