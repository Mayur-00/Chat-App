import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`DB Connected!`);
        
    } catch (error) {
        console.log(`DB Connection Error: ${error}`);
        
    };
};