import request from 'supertest';
import express, { Express } from 'express';
import userRoutes from '../routes/user.routes';
import User from '../models/user.model';
import fs from 'fs';

jest.mock('../models/user.model');
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
                req.file = { filename: 'test-avatar.png' };
            }
            next();
        }
    }
}));

const app: Express = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users/profile', () => {
        it('should return user profile successfully', async () => {
            const mockUser = {
                _id: 'mockUserId123',
                username: 'testUser',
                email: 'test@example.com',
                avatarUrl: '/uploads/profiles/test-avatar.png'
            };

            (User.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const response = await request(app).get('/api/users/profile');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 'mockUserId123',
                username: 'testUser',
                email: 'test@example.com',
                avatarUrl: '/uploads/profiles/test-avatar.png'
            });
            expect(User.findById).toHaveBeenCalledWith('mockUserId123');
        });

        it('should return 404 if user not found', async () => {
            (User.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const response = await request(app).get('/api/users/profile');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        });

        it('should handle internal errors gracefully', async () => {
            (User.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error('DB Error'))
            });

            const response = await request(app).get('/api/users/profile');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'DB Error' });
        });
    });

    describe('PUT /api/users/profile', () => {
        it('should update profile successfully with no image upload', async () => {
            const mockUser = {
                _id: 'mockUserId123',
                username: 'oldUsername',
                save: jest.fn().mockResolvedValue(true)
            };

            (User.findById as jest.Mock).mockResolvedValue(mockUser);
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/api/users/profile')
                .send({ username: 'newUsername' });

            expect(response.status).toBe(200);
            expect(mockUser.username).toBe('newUsername');
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should update profile successfully with image upload', async () => {
            const mockUser = {
                _id: 'mockUserId123',
                username: 'oldUsername',
                avatarUrl: '/uploads/profiles/old.png',
                save: jest.fn().mockResolvedValue(true)
            };

            (User.findById as jest.Mock).mockResolvedValue(mockUser);
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

            const response = await request(app)
                .put('/api/users/profile')
                .send({ mockFile: true }); // triggers our mocked upload middleware

            expect(response.status).toBe(200);
            expect(mockUser.avatarUrl).toBe('/uploads/profiles/test-avatar.png');
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should return 400 if username is already taken', async () => {
            const mockUser = {
                _id: 'mockUserId123',
                username: 'oldUsername'
            };

            (User.findById as jest.Mock).mockResolvedValue(mockUser);
            (User.findOne as jest.Mock).mockResolvedValue({ _id: 'anotherUserId' });

            const response = await request(app)
                .put('/api/users/profile')
                .send({ username: 'takenUsername' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Username already taken' });
        });

        it('should return 404 if user is not found during update', async () => {
            (User.findById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/api/users/profile')
                .send({ username: 'newUsername' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        });
    });
});
