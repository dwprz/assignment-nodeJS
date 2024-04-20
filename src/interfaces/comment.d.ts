interface CreatePostCommentRequest {
  userName: string;
  postId: number;
  comment: string;
  tags?: string[];
}

interface getPostCommentsRequest {
  userId: number;
  postId: number;
}

interface UpdatePostCommentRequest {
  commentId: number;
  comment?: string;
  tags?: string[];
}

interface PostTotalComments {
  postId: number;
  totalComments: number;
}

interface PostComment {
  commentId: number;
  userName: string;
  comment: string;
  edited: boolean;
  tags: string[];
  postId: number;
  createdAt: Date;
  updatedAt?: Date | null;
  liked?: number;
  totalSubComments?: number;
}
