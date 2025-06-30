import mongoose from "mongoose";

export const DBconnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URI);
    console.log("data connected: " + conn.connection.host);
  } catch (error) {
    console.log("error connecting to database:" + error);
  }
};
