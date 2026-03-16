import request from 'supertest';
import express, { Express } from 'express';
import socialRoutes from '../routes/social.routes';
import Post from '../models/post.model';
import Comment from '../models/comment.model';
import fs from 'fs';

// Mock dependencies
jest.mock('../models/post.model');
jest.mock('../models/comment.model');
jest.mock('fs');

jest.mock('../middleware/auth.middleware', () => ({
    authenticateToken: (req: any, res: any, next: any) => {
        req.user = { id: 'mockUserId123' };
        next();
    }
}));

jest.mock('../middleware/upload.middleware', () => ({
    upload: {
        single: () => (req: any, res: any, next: any) => {
            if (req.body.mockFile) {
                req.file = { filename: 'test-image.png' };
            }
            next();
        }
    }
}));

const app: Express = express();
app.use(express.json());
app.use('/api/social', socialRoutes);

describe('Social Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Post Routes', () => {
        describe('POST /api/social', () => {
            it('should create a new post successfully', async () => {
                const mockPost = {
                    _id: 'mockPostId123',
                    author: 'mockUserId123',
                    gameId: 'game1',
                    seasonCode: 'season1',
                    text: 'Hello world',
                    imageUrl: undefined,
                    save: jest.fn().mockResolvedValue(true),
                    populate: jest.fn().mockResolvedValue(true)
                };

                (Post as unknown as jest.Mock).mockImplementation(() => mockPost);

                const response = await request(app)
                    .post('/api/social')
                    .send({ gameId: 'game1', seasonCode: 'season1', text: 'Hello world' });

                expect(response.status).toBe(201);
                expect(mockPost.save).toHaveBeenCalled();
                expect(mockPost.populate).toHaveBeenCalledWith('author', 'username avatarUrl');
            });

            it('should create a new post with image', async () => {
                const mockPost = {
                    _id: 'mockPostId123',
                    author: 'mockUserId123',
                    gameId: 'game1',
                    seasonCode: 'season1',
                    text: 'Hello world',
                    imageUrl: '/uploads/posts/test-image.png',
                    save: jest.fn().mockResolvedValue(true),
                    populate: jest.fn().mockResolvedValue(true)
                };

                (Post as unknown as jest.Mock).mockImplementation(() => mockPost);

                const response = await request(app)
                    .post('/api/social')
                    .send({ gameId: 'game1', seasonCode: 'season1', text: 'Hello world', mockFile: true });

                expect(response.status).toBe(201);
                expect(mockPost.save).toHaveBeenCalled();
            });
        });

        describe('GET /api/social/game/:seasonCode/:gameId', () => {
            it('should get posts by game', async () => {
                const mockPosts = [{ _id: 'post1' }, { _id: 'post2' }];

                const mockFind = {
                    populate: jest.fn().mockReturnThis(),
                    sort: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue(mockPosts)
                };

                (Post.find as jest.Mock).mockReturnValue(mockFind);
                (Post.countDocuments as jest.Mock).mockResolvedValue(2);

                const response = await request(app).get('/api/social/game/season1/game1');

                expect(response.status).toBe(200);
                expect(response.body.posts).toHaveLength(2);
                expect(response.body.totalPosts).toBe(2);
            });
        });

        describe('GET /api/social/user/:userId', () => {
            it('should get posts by user', async () => {
                const mockPosts = [{ _id: 'post1' }];

                const mockFind = {
                    populate: jest.fn().mockReturnThis(),
                    sort: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue(mockPosts)
                };

                (Post.find as jest.Mock).mockReturnValue(mockFind);
                (Post.countDocuments as jest.Mock).mockResolvedValue(1);

                const response = await request(app).get('/api/social/user/user1');

                expect(response.status).toBe(200);
                expect(response.body.posts).toHaveLength(1);
                expect(response.body.totalPosts).toBe(1);
            });
        });

        describe('PUT /api/social/:postId', () => {
            it('should update post if authorized', async () => {
                const mockPost = {
                    _id: 'postId1',
                    author: 'mockUserId123',
                    text: 'old text',
                    save: jest.fn().mockResolvedValue(true),
                    populate: jest.fn().mockResolvedValue(true)
                };

                (Post.findById as jest.Mock).mockResolvedValue(mockPost);

                const response = await request(app)
                    .put('/api/social/postId1')
                    .send({ text: 'new text' });

                expect(response.status).toBe(200);
                expect(mockPost.text).toBe('new text');
                expect(mockPost.save).toHaveBeenCalled();
            });

            it('should block update if unauthorized', async () => {
                const mockPost = {
                    _id: 'postId1',
                    author: 'anotherUserId',
                    text: 'old text'
                };

                (Post.findById as jest.Mock).mockResolvedValue(mockPost);

                const response = await request(app)
                    .put('/api/social/postId1')
                    .send({ text: 'new text' });

                expect(response.status).toBe(403);
            });
        });

        describe('DELETE /api/social/:postId', () => {
            it('should delete post if authorized', async () => {
                const mockPost = {
                    _id: 'postId1',
                    author: 'mockUserId123'
                };

                (Post.findById as jest.Mock).mockResolvedValue(mockPost);
                (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

                const response = await request(app).delete('/api/social/postId1');

                expect(response.status).toBe(200);
                expect(Post.findByIdAndDelete).toHaveBeenCalledWith('postId1');
            });
        });

        describe('POST /api/social/:postId/like', () => {
            it('should toggle like on post', async () => {
                const mockPost = {
                    _id: 'postId1',
                    likes: [],
                    save: jest.fn().mockResolvedValue(true)
                };

                (Post.findById as jest.Mock).mockResolvedValue(mockPost);

                const response = await request(app).post('/api/social/postId1/like');

                expect(response.status).toBe(200);
                expect(mockPost.likes).toContain('mockUserId123');
                expect(mockPost.save).toHaveBeenCalled();
            });
        });
    });

    describe('Comment Routes', () => {
        describe('POST /api/social/comments', () => {
            it('should add comment', async () => {
                const mockComment = {
                    _id: 'comment1',
                    author: 'mockUserId123',
                    postId: 'post1',
                    text: 'comment text',
                    save: jest.fn().mockResolvedValue(true),
                    populate: jest.fn().mockResolvedValue(true)
                };

                (Comment as unknown as jest.Mock).mockImplementation(() => mockComment);

                const response = await request(app)
                    .post('/api/social/comments')
                    .send({ postId: 'post1', content: 'comment text' });

                expect(response.status).toBe(201);
                expect(mockComment.save).toHaveBeenCalled();
            });
        });

        describe('GET /api/social/:postId/comments', () => {
            it('should get comments for post', async () => {
                const mockComments = [{ _id: 'comment1' }];

                const mockFind = {
                    populate: jest.fn().mockReturnThis(),
                    sort: jest.fn().mockResolvedValue(mockComments)
                };

                (Comment.find as jest.Mock).mockReturnValue(mockFind);

                const response = await request(app).get('/api/social/post1/comments');

                expect(response.status).toBe(200);
                expect(response.body).toHaveLength(1);
            });
        });

        describe('DELETE /api/social/comments/:commentId', () => {
            it('should delete comment if authorized', async () => {
                const mockComment = {
                    _id: 'comment1',
                    author: 'mockUserId123'
                };

                (Comment.findById as jest.Mock).mockResolvedValue(mockComment);
                (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

                const response = await request(app).delete('/api/social/comments/comment1');

                expect(response.status).toBe(200);
                expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment1');
            });

            it('should block delete if unauthorized', async () => {
                const mockComment = {
                    _id: 'comment1',
                    author: 'anotherUserId'
                };

                (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

                const response = await request(app).delete('/api/social/comments/comment1');

                expect(response.status).toBe(403);
            });
        });
    });
});
