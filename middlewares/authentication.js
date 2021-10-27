const jwt = require("jsonwebtoken");
const User = require("../models/signup");


  const validateToken = (req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
      const options = {
        expiresIn: "2d",
      };
      try {
        result = jwt.verify(token, process.env.SECRET, options);
        req.decoded = result;
        //res.json({message:result});
        //console.log(result);
        
        next();

      } catch (err) {
        res.status(500).json( "Invalid token!");
        
      }
    } else {
      result = {
        error: `Authentication error. Token required.`,
        status: 401,
      };
      res.status(401).send(result);
    }
  }

const checkUser = async (req, res, next) => {
 
  const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
      const options = {
        expiresIn: "2d",
      };
      try {
        result = jwt.verify(token, process.env.SECRET, options);
        req.decoded = result;
    
     
        let user = await User.findById(result.id);
        res.status(200).json(user);
       
      } catch (err) {
        res.status(500).json(err);

      }};
    
module.exports = { validateToken, checkUser };