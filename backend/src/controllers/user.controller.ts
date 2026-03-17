import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/user.model';
import fs from 'fs';
import path from 'path';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { username, avatarUrl } = req.body;
        const user = await User.findById(req.user?.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
            if (existingUser) return res.status(400).json({ error: 'Username already taken' });
            user.username = username;
        }

        if (req.file) {
            if (user.avatarUrl && user.avatarUrl.startsWith('/api/uploads/profiles/')) {
                const oldAvatarPath = path.join(process.cwd(), user.avatarUrl.substring(1));
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }
            user.avatarUrl = `/api/uploads/profiles/${req.file.filename}`;
        }

        await user.save();
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
