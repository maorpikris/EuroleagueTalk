import { Request, Response } from 'express';
import Post from '../models/post.model';
import fs from 'fs';
import path from 'path';

export class PostController {
    async createPost(req: Request, res: Response) {
        try {
            const { gameId, seasonCode, text } = req.body;
            const author = (req as any).user?.id;

            if (!author) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const imageUrl = req.file ? `/api/uploads/posts/${req.file.filename}` : undefined;

            const post = new Post({
                author,
                gameId,
                seasonCode,
                text,
                imageUrl
            });

            await post.save();
            await post.populate('author', 'username avatarUrl');

            res.status(201).json(post);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPostsByGame(req: Request, res: Response) {
        try {
            const { seasonCode, gameId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const posts = await Post.find({ gameId, seasonCode })
                .populate('author', 'username avatarUrl')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Post.countDocuments({ gameId, seasonCode });

            res.json({
                posts,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPosts: total
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPostsByUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const posts = await Post.find({ author: userId })
                .populate('author', 'username avatarUrl')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Post.countDocuments({ author: userId });

            res.json({
                posts,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPosts: total
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updatePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const { text } = req.body;
            const userId = (req as any).user?.id;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            if (post.author.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Unauthorized to update this post' });
            }

            post.text = text;
            await post.save();
            await post.populate('author', 'username avatarUrl');

            res.json(post);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = (req as any).user?.id;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            if (post.author.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Unauthorized to delete this post' });
            }

            // Delete image if exists
            if (post.imageUrl) {
                const imagePath = path.join(process.cwd(), post.imageUrl.substring(1));
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await Post.findByIdAndDelete(postId);
            res.json({ message: 'Post deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async toggleLike(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = (req as any).user?.id;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const likeIndex = post.likes.indexOf(userId);

            if (likeIndex === -1) {
                post.likes.push(userId);
            } else {
                post.likes.splice(likeIndex, 1);
            }

            await post.save();
            res.json({ likes: post.likes });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
