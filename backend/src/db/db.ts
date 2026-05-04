import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
    await mongoose.connect(process.env.DB_URI as string)

    console.log("Connected to DB")
}

export default connectDB
