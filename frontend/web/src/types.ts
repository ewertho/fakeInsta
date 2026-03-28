export type UserPublic = {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  avatarUrl: string | null;
  isVerified: boolean;
};

export type PostAuthor = {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  isVerified: boolean;
};

export type Post = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  likedByMe: boolean;
};

export type StoryItem = {
  id: string;
  imageUrl: string;
  expiresAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
};

export type SuggestionUser = {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  followedByUsername: string | null;
};

export type MessagePreview = {
  id: string;
  other: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  snippet: string;
  createdAt: string;
  unread: boolean;
};

export type ReelItem = {
  id: string;
  videoUrl: string;
  caption: string;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  likedByMe: boolean;
};

export type ProfilePayload = {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  posts: { id: string; imageUrl: string }[];
};
