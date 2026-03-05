import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { CommentController } from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();
const postController = new PostController();
const commentController = new CommentController();

// Post routes
router.post('/', authenticateToken, upload.single('image'), postController.createPost);
router.get('/game/:seasonCode/:gameId', postController.getPostsByGame);
router.get('/user/:userId', postController.getPostsByUser);
router.put('/:postId', authenticateToken, postController.updatePost);
router.delete('/:postId', authenticateToken, postController.deletePost);
router.post('/:postId/like', authenticateToken, postController.toggleLike);

// Comment routes
router.post('/comments', authenticateToken, commentController.addComment);
router.get('/:postId/comments', commentController.getCommentsByPost);
router.delete('/comments/:commentId', authenticateToken, commentController.deleteComment);

export default router;
