interface CreatePostRequest {
  userName: string;
  title: string;
  body: string;
  contents?: string[];
}

interface UpdatePostRequest {
  postId: number;
  title?: string;
  body?: string;
  userName: string;
}

interface Post {
  postId: number;
  title: string;
  body: string;
  userName: string;
  edited: boolean;
  contents: string[];
  createdAt: Date;
  updatedAt?: Date;
  totalLikes?: number;
  totalComments?: number;
  liked?: boolean;
}

interface GetRandomLoggedInUserRequest {
  userName: string;
  page: number;
}

interface GetPostsByUser {
  userName: string;
  page: number;
}
