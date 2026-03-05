import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Stack, TextField, IconButton, CircularProgress } from '@mui/material';
import { Send, Trash2 } from 'lucide-react';
import type { Comment } from '../types/social';
import { useAuth } from '../contexts/AuthContext';
import { addComment, getCommentsByPost, deleteComment } from '../services/api';

interface Props {
    postId: string;
}

const CommentSection = ({ postId }: Props) => {
    const { user } = useAuth();
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getCommentsByPost(postId);
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!newComment.trim() || submitting || !user) return;

        setSubmitting(true);
        try {
            const comment = await addComment({ postId, text: newComment });
            setComments([...comments, comment]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    if (loading) return <CircularProgress size={20} />;

    return (
        <Box>
            <Stack spacing={2} sx={{ mb: 3 }}>
                {comments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No comments yet. Be the first to comment!</Typography>
                ) : (
                    comments.map((comment) => (
                        <Stack key={comment._id} direction="row" spacing={2} alignItems="flex-start">
                            <Avatar
                                src={comment.author.avatarUrl?.startsWith('/') ? `${serverUrl}${comment.author.avatarUrl}` : comment.author.avatarUrl}
                                alt={comment.author.username}
                                sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 3, flex: 1, position: 'relative' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        {comment.author.username}
                                        <Box component="span" sx={{ ml: 1, fontWeight: 400, fontSize: '0.75rem', color: 'text.secondary' }}>
                                            • {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Box>
                                    </Typography>
                                    {user?.id === comment.author._id && (
                                        <IconButton size="small" onClick={() => handleDelete(comment._id)}>
                                            <Trash2 size={14} />
                                        </IconButton>
                                    )}
                                </Stack>
                                <Typography variant="body2">{comment.text}</Typography>
                            </Box>
                        </Stack>
                    ))
                )}
            </Stack>

            {user && (
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
                    <Avatar
                        src={user.avatarUrl?.startsWith('/') ? `${serverUrl}${user.avatarUrl}` : user.avatarUrl}
                        alt={user.username}
                        sx={{ width: 32, height: 32 }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 3 }
                        }}
                    />
                    <IconButton
                        color="primary"
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                    >
                        {submitting ? <CircularProgress size={20} /> : <Send size={20} />}
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default CommentSection;
