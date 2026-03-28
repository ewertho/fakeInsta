export type Post = {
  id: string;
  author: string;
  place: string | null;
  description: string;
  hashtags: string | null;
  imageUrl: string;
  likes: number;
  createdAt: string;
};
