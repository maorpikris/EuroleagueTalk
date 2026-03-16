import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { CommentController } from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();
const postController = new PostController();
const commentController = new CommentController();

/**
 * @swagger
 * tags:
 *   name: Social
 *   description: Post and Comment management
 */

// Post routes

/**
 * @swagger
 * /api/social:
 *   post:
 *     summary: Create a new post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               seasonCode:
 *                 type: string
 *               gameId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/', authenticateToken, upload.single('image'), postController.createPost);

/**
 * @swagger
 * /api/social/game/{seasonCode}/{gameId}:
 *   get:
 *     summary: Get posts by game
 *     tags: [Social]
 *     parameters:
 *       - in: path
 *         name: seasonCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/game/:seasonCode/:gameId', postController.getPostsByGame);

/**
 * @swagger
 * /api/social/user/{userId}:
 *   get:
 *     summary: Get posts by user
 *     tags: [Social]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/user/:userId', postController.getPostsByUser);

/**
 * @swagger
 * /api/social/{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put('/:postId', authenticateToken, postController.updatePost);

/**
 * @swagger
 * /api/social/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete('/:postId', authenticateToken, postController.deletePost);

/**
 * @swagger
 * /api/social/{postId}/like:
 *   post:
 *     summary: Toggle like on a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled successfully
 */
router.post('/:postId/like', authenticateToken, postController.toggleLike);

// Comment routes

/**
 * @swagger
 * /api/social/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/comments', authenticateToken, commentController.addComment);

/**
 * @swagger
 * /api/social/{postId}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Social]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get('/:postId/comments', commentController.getCommentsByPost);

/**
 * @swagger
 * /api/social/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/comments/:commentId', authenticateToken, commentController.deleteComment);

export default router;
