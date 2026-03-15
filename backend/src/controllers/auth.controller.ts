import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (user: any) => {
    const accessToken = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = new User({
            username,
            password,
            email: email === '' ? undefined : email
        });
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            user: { id: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl },
            accessToken,
            refreshToken
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            user: { id: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl },
            accessToken,
            refreshToken
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err: any, decoded: any) => {
            if (err) return res.status(403).json({ error: 'Expired or invalid refresh token' });

            const tokens = generateTokens(user);
            user.refreshToken = tokens.refreshToken;
            user.save();

            res.json(tokens);
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const user = await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: 'Google ID Token is required' });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ error: 'Invalid Google token' });
        }

        const { sub: googleId, name: username, email, picture: avatarUrl } = payload;
        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
                if (!user.avatarUrl) user.avatarUrl = avatarUrl;
                await user.save();
            } else {
                user = new User({
                    googleId,
                    username,
                    email: email === '' ? undefined : email,
                    avatarUrl
                });
                await user.save();
            }
        }

        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({
            user: { id: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (error: any) {
        console.error('Google Auth error:', error);
        res.status(500).json({ error: error.message });
    }
};
