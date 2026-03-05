import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    author: mongoose.Types.ObjectId;
    gameId: string;
    seasonCode: string;
    text: string;
    imageUrl?: string;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameId: { type: String, required: true },
    seasonCode: { type: String, required: true },
    text: { type: String, required: true, maxlength: 1000 },
    imageUrl: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IPost>('Post', postSchema);
