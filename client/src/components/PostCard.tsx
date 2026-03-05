import { useState } from 'react';
import { Box, Typography, Avatar, IconButton, Paper, Stack, Button, TextField, Menu, MenuItem } from '@mui/material';
import { Heart, MessageCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Post } from '../types/social';
import { useAuth } from '../contexts/AuthContext';
import { toggleLike, updatePost, deletePost } from '../services/api';
import CommentSection from './CommentSection';

interface Props {
    post: Post;
    onDelete?: (postId: string) => void;
    onUpdate?: (updatedPost: Post) => void;
}

const PostCard = ({ post, onDelete, onUpdate }: Props) => {
    const { user } = useAuth();
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    const [likes, setLikes] = useState<string[]>(post.likes);
    const [showComments, setShowComments] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text);

    const isLiked = user ? likes.includes(user.id) : false;
    const isOwner = user?.id === post.author._id;

    const handleLike = async () => {
        if (!user) return;
        try {
            const response = await toggleLike(post._id);
            setLikes(response.likes);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedPost = await updatePost(post._id, { text: editText });
            if (onUpdate) onUpdate(updatedPost);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update post:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(post._id);
            if (onDelete) onDelete(post._id);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
        setAnchorEl(null);
    };

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 4, border: '1px solid #e0e0e0' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar
                    src={post.author.avatarUrl?.startsWith('/') ? `${serverUrl}${post.author.avatarUrl}` : post.author.avatarUrl}
                    alt={post.author.username}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        {post.author.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                </Box>
                {isOwner && (
                    <>
                        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <MoreVertical size={18} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={() => { setIsEditing(true); setAnchorEl(null); }}>
                                <Edit2 size={16} style={{ marginRight: 8 }} /> Edit
                            </MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                <Trash2 size={16} style={{ marginRight: 8 }} /> Delete
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Stack>

            {isEditing ? (
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        sx={{ mb: 1 }}
                    />
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button size="small" variant="contained" onClick={handleUpdate}>Save</Button>
                    </Stack>
                </Box>
            ) : (
                <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {post.text}
                </Typography>
            )}

            {post.imageUrl && (
                <Box sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                    <img
                        src={`${serverUrl}${post.imageUrl}`}
                        alt="Post attachment"
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', background: '#f5f5f5' }}
                    />
                </Box>
            )}

            <Stack direction="row" spacing={3}>
                <Button
                    startIcon={<Heart size={20} fill={isLiked ? '#ff1744' : 'transparent'} />}
                    color={isLiked ? 'error' : 'inherit'}
                    onClick={handleLike}
                    sx={{ textTransform: 'none' }}
                >
                    {likes.length}
                </Button>
                <Button
                    startIcon={<MessageCircle size={20} />}
                    color="inherit"
                    onClick={() => setShowComments(!showComments)}
                    sx={{ textTransform: 'none' }}
                >
                    Comments
                </Button>
            </Stack>

            {showComments && (
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f0f0f0' }}>
                    <CommentSection postId={post._id} />
                </Box>
            )}
        </Paper>
    );
};

export default PostCard;
