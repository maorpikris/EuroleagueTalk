import { Request, Response } from 'express';
import Comment from '../models/comment.model';

export class CommentController {
    async addComment(req: Request, res: Response) {
        try {
            const { postId, text } = req.body;
            const author = (req as any).user?.id;

            if (!author) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const comment = new Comment({
                author,
                postId,
                text
            });

            await comment.save();
            await comment.populate('author', 'username avatarUrl');

            res.status(201).json(comment);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCommentsByPost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const comments = await Comment.find({ postId })
                .populate('author', 'username avatarUrl')
                .sort({ createdAt: 1 });
            res.json(comments);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const { commentId } = req.params;
            const userId = (req as any).user?.id;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            if (comment.author.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Unauthorized to delete this comment' });
            }

            await Comment.findByIdAndDelete(commentId);
            res.json({ message: 'Comment deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
