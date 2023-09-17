import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';


//configure env
dotenv.config();

//database config  function calling
connectDB();

//esmodule fix
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,'./client/build')));


//routes
app.use("/api/v1/auth", authRoutes);     //second parameter is authRoute.js file 
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to ecommerce app</h1>");
// });
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

//PORT
 const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});

//react port =>3000 
// angular port =>4200
// node port=>8080


//if we want to use ES6 then we add type:"module" in package.json file
// and require module is not defined in ES6 so use import statement


//we secure our port DBPOrt ,payment gateway so we put into in .env file 

//we ad start server client commang in apckage.json file which we we execute in a row using conurrently  we install this in our project npppm i concurrently  we tyoe npm run dev command in terminal whcih execute both npm run server npm run client  
