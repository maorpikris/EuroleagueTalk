export interface Author {
    _id: string;
    username: string;
    avatarUrl?: string;
}

export interface Post {
    _id: string;
    author: Author;
    gameId: string;
    text: string;
    imageUrl?: string;
    likes: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    author: Author;
    postId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}
