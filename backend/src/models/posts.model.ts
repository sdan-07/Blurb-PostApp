import mongoose, { Document, Model, Types } from 'mongoose'

export interface IPost extends Document {
    image: string;
    fileId: string;
    caption: string;
    user: Types.ObjectId;
    date: string;
}

const postsSchema = new mongoose.Schema<IPost>({
    image: String,
    fileId: String,
    caption: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    date: String
})

const postsModel: Model<IPost> = mongoose.model<IPost>("posts", postsSchema)

export default postsModel
