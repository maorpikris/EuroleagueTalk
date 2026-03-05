import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    author: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', commentSchema);
