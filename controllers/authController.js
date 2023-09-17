//here we import two models user model and order model  
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//registerController  handles user registsration
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;  //xtracts the required fields  from the request body
    //validations
          if (!name) {
            return res.send({ error: "Name is Required" });
          }
          if (!email) {
            return res.send({ message: "Email is Required" });
          }
          if (!password) {
            return res.send({ message: "Password is Required" });
          }
          if (!phone) {
            return res.send({ message: "Phone no is Required" });
          }
          if (!address) {
            return res.send({ message: "Address is Required" });
          }
          if (!answer) {
            return res.send({ message: "Answer is Required" });
          }
    //check user if it exist in the DB
    const exisitingUser = await userModel.findOne({ email });
    //if exisiting user
    if (exisitingUser) {
      return res.status(200).send({     //200 means ok
        success: false,
        message: "Already Register please login",
      });
    }
    //registering the  user firstly hashes the password 
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({        //201 means created 
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({    //500 means internal server error
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//POST LOGIN   handles user Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;    
    //validation
    if (!email || !password) {
      return res.status(404).send({     //not found 
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user exists
    const user = await userModel.findOne({ email });
    //if not exists
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    //if exists then it compares the provided passowrd with the stored hashed password 
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({    //200 means ok
        success: false,
        message: "Invalid Password",
      });
    }
    //if match then  it generates a JSON Web Token (JWT) with the user's ID and sends a success response with the user details and the token.
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {    //JWT_SECRET declared is in .env 
      expiresIn: "7d",  //i.e. if user login it remains login for 7 days until they logout
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController  handles password reset functionality.

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    //validation if any field is missing
    if (!email) {          //400 means bad request 
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //checks if the user exists in the database with the provided email and answe
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    // If the user exists, it hashes the new password and updates the user's password in the database
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller is a  simple controller used for testing protected routes
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");  //sends a response indicating that the route is protected.
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update profile handles updating user profiles
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;   //extracts the updated fields (name, email, password, address, phone) from the request body
    const user = await userModel.findById(req.user._id);   //. It then fetches the user based on the authenticated user ID (obtained from the token)
    //password validation
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    //hashes the password and update the userProfile  in DB
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders  it  fetches all orders associated with a specific user.
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel    //retrieves the orders from the database based on the authenticated user's ID, populates the associated products and buyer details, and sends a response with the orders.
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } 
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders   fetches all orders in the system
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel        //retrieves all orders from the database, populates the associated products and buyer details  sorts them by creation date, and sends a response with the orders.
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status --function handles updating the status of an order
export const orderStatusController = async (req, res) => {
  try {
    //extracts the order ID from the request parameters and the status from the request body.
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
