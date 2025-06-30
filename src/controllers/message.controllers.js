import { v2 as cloudinary } from "cloudinary";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getRecieverID, io } from "../lib/socket.js";

export const getAllUser = async (req, res) => {
  try {
    const myID = req.user._id;
    const filteredUse = await User.find({ _id: { $ne: myID } }).select(
      "-password"
    );
    res.status(200).json(filteredUse);
  } catch (error) {
    // console.log("error in getall user" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userTOchatID } = req.params;
    const myID = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderID: myID, recieverID: userTOchatID },
        { senderID: userTOchatID, recieverID: myID },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    // console.log("getMessages error" + error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverID } = req.params;
    const myID = req.user._id;

    let imageURL;
    if (image) {
      const uploadImageUrl = await cloudinary.uploader.upload(image);
      imageURL = uploadImageUrl.secure_url;
    }

    const New_message = new Message({
      senderID: myID,
      recieverID,
      text,
      image: imageURL,
    });

    await New_message.save();

    // real time functionality socket .io

    const reciecerSocketID = getRecieverID(recieverID);
    if (reciecerSocketID) {
      io.to(reciecerSocketID).to(myID).emit("newMessage", New_message);
    }

    res.status(201).json(New_message);
  } catch (error) {
    // console.log("error in sendMessage" + error);
    res.status(500).json({ message: "internal server error" });
  }
};
