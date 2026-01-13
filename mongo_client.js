import dotenv from "dotenv";
import {MongoClient} from "mongodb";

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;
if (!mongoUrl) {
  throw new Error("MONGODB_URL is not defined in environment");
}
const client = new MongoClient(mongoUrl);

let isConnected = false;

export async function connectDB(){
  try {
    if(!isConnected){
      await client.connect();
      isConnected = true;
      return{success:true, message: "Instantiated connection to MongoDB", client};
    }

    return { success: true, message: "Already Connected to MongoDB" , client};
  } catch (error) {
    return {success: false, message: error.message};
  }
}
