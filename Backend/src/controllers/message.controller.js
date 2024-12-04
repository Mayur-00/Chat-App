import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedinUser = req.user._id;
        const fileterdUsers = await User.find({ _id: { $ne: loggedinUser } }).select("-password");

        res.status(200).json(fileterdUsers);
    } catch (error) {
        console.log(`error in getUsersForSlidebar controller: ${error}`);
        res.send(500).json({ message: "internal sever error" });

    };
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChat } = req.params;
        const myId = req.user._id;
        const message = await Message.find({
            $or: [  
                { senderId: myId, receiverId: userToChat },
                { senderId: userToChat, receiverId: myId }
            ]
        });

        res.status(200).json(message);
    } catch (error) {
        console.log(`error in getMessage Controller ${error}`);
        res.status(500).json({ message: "internal server error" });

    };

};

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadRespnse = await cloudinary.uploader.upload(image);
            imageUrl = uploadRespnse.secure_url;
        }

        const newMessage = new Message(
            {
                senderId,
                receiverId,
                text,
                images: imageUrl,
            });

        await newMessage.save();

        // todo: Real time functionality goes here => socket.io

        res.status(201).json(newMessage);

    } catch (error) {
        console.log(`error in sendMessage controller : ${error}`);
        res.status(500).json({ error: "internal server eraror" })


    }

};