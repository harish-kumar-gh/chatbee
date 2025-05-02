import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log(`Something went wrong while connecting to mongoDB: ${error}`);
        process.exit(1);
    }
}