import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Database connected!")
    } catch (error) {
        console.log("Error while connecting databse", error);
    }
};

export default connectDB;