import mongoose, { Document, Model } from 'mongoose'

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel: Model<IUser> = mongoose.model<IUser>("users", userSchema)

export default userModel
