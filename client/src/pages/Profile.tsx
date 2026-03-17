import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Avatar, Paper, Stack, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, getPostsByUser } from '../services/api';
import type { Post as PostType } from '../types/social';
import PostCard from '../components/PostCard';

const Profile: React.FC = () => {
    const { user, loading: authLoading, updateUser } = useAuth();
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const serverUrl = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setAvatarPreview(
                user.avatarUrl?.startsWith('/')
                    ? `${serverUrl}${user.avatarUrl}`
                    : user.avatarUrl || ''
            );
        }
    }, [user, serverUrl]);


    useEffect(() => {
        if (user) {
            const fetchUserPosts = async () => {
                setLoadingPosts(true);
                try {
                    const data = await getPostsByUser(user.id, page);
                    setPosts(data.posts);
                    setTotalPages(data.totalPages);
                } catch (error) {
                    console.error('Failed to fetch user posts:', error);
                } finally {
                    setLoadingPosts(false);
                }
            };
            fetchUserPosts();
        }
    }, [user?.id, page]);

    const handlePostDeleted = (postId: string) => {
        setPosts(posts.filter(p => p._id !== postId));
    };

    const handlePostUpdated = (updatedPost: PostType) => {
        setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h5">Please login to view your profile.</Typography>
            </Container>
        );
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', username);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            const updatedUser = await updateProfile(formData);
            updateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setAvatarFile(null); // Clear file after successful upload
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        src={avatarPreview}
                        sx={{ width: 100, height: 100, mb: 2, border: '4px solid', borderColor: 'primary.main' }}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h4" fontWeight={800}>User Profile</Typography>
                    <Typography color="text.secondary">{user.email || 'No email provided'}</Typography>
                </Box>

                {message && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            helperText="This is how other users will see you"
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ mt: 1, borderRadius: 2 }}
                        >
                            Upload Profile Picture
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </Button>
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            JPG, PNG or GIF. Max size 5MB.
                        </Typography>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading || (username === user.username && !avatarFile)}
                            sx={{ mt: 2, py: 1.5 }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>My Posts</Typography>
                {loadingPosts ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Stack spacing={3}>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onDelete={handlePostDeleted}
                                        onUpdate={handlePostUpdated}
                                    />
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                                    You haven't posted anything yet.
                                </Typography>
                            )}
                        </Stack>

                        {totalPages > 1 && (
                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                                <Button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <Typography sx={{ alignSelf: 'center' }}>
                                    Page {page} of {totalPages}
                                </Typography>
                                <Button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </Stack>
                        )}
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Profile;
