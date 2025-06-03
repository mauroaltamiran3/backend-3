import { connect } from "mongoose";

const dbConnect = async (url) => {
  try {
    await connect(url);
    console.log("connected to mongoDB");
  } catch (error) {
    console.log(error.message);
  }
};

export default dbConnect;
