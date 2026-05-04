export interface Post {
  id: string;
  userId: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
