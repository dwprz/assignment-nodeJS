interface CreatePostLikeRequest {
  userName: string;
  postId: number;
}

interface DeletePostLikeRequest {
  userName: string;
  postId: number;
}

interface CreatePostCommentLikeRequest {
  userId: number;
  commentId: number;
}

interface DeletePostCommentLikeRequest {
  userId: number;
  commentId: number;
}

interface CreatePostSubCommentLikeRequest {
  userId: number;
  subCommentId: number;
}

interface DeletePostSubCommentLikeRequest {
  userId: number;
  subCommentId: number;
}

interface PostTotalLikes {
  postId: number;
  totalLikes: number;
}

interface LikedPostByUser {
  postId: number;
  liked: boolean;
}

interface PostListLike {
  userName: string;
}

interface PostLike {
  userName: string;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PostCommentLike {
  userId: number;
  commentId: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface PostSubCommentLike {
  userId: number;
  subCommentId: number;
  createdAt: Date;
  updatedAt?: Date | null;
}
