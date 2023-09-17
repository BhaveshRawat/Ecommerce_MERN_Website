import mongoose from "mongoose";
import colors from "colors";


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);  //connection to mongoDB
    console.log(
      `Conneted To Mongodb Databse ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Errro in Mongodb ${error}`.bgRed.white);
  }
};

export default connectDB;

//we create a DB named ecommerce-app and a collection users inside it
//in DB acess field in mongoDB atlas we store our username and password  and in network acess we enter an white list our IP adress 0.0.0.0/0 which we access from a
//when we click on connect it shows a list of options whom to connect if we want ot connect it with mongodb compass  then  paste that link in compass 