import React, { useState, useRef } from 'react';
import { Box, TextField, Button, IconButton, Typography, Paper } from '@mui/material';
import { Image as ImageIcon, X } from 'lucide-react';
import { createPost } from '../services/api';

interface Props {
    gameId: string;
    seasonCode: string;
    onPostCreated: (post: any) => void;
}

const CreatePost: React.FC<Props> = ({ gameId, seasonCode, onPostCreated }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !image) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('gameId', gameId);
            formData.append('seasonCode', seasonCode);
            formData.append('text', text);
            if (image) {
                formData.append('image', image);
            }

            const newPost = await createPost(formData);
            onPostCreated(newPost);
            setText('');
            handleRemoveImage();
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #e0e0e0' }}>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share your thoughts about this game..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: '#f9f9f9'
                        }
                    }}
                    inputProps={{ maxLength: 1000 }}
                />

                {imagePreview && (
                    <Box sx={{ position: 'relative', mb: 2, display: 'inline-block' }}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                        />
                        <IconButton
                            onClick={handleRemoveImage}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                            }}
                            size="small"
                        >
                            <X size={16} />
                        </IconButton>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <Button
                            variant="text"
                            startIcon={<ImageIcon size={20} />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ borderRadius: 2 }}
                        >
                            Photo
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            {text.length}/1000
                        </Typography>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || (!text.trim() && !image)}
                            sx={{ borderRadius: 10, px: 4 }}
                        >
                            Post
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default CreatePost;
