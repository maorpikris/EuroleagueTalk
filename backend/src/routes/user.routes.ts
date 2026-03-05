import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, upload.single('avatar'), userController.updateProfile);

export default router;
