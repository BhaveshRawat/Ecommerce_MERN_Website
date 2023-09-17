//JWT is a library used for creating and verifying json web token 
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

 //it ensures that a user is authenticated before granting access to protected routes 
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(     //verifies the JWT token from the Authorization header of the request
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;  //sets the decoded user information to req.user
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin acceess check 
export const isAdmin = async (req, res, next) => {
  try {  //retrieves the user information from the database based on the user's ID obtained from the req.user._id
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    }
    // if the user is an admin
    else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({   //401 means unauthorised 
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};


