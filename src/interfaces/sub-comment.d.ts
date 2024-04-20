interface CreatePostSubCommentRequest {
  userName: string;
  commentId: number;
  comment: string;
  tags?: string[];
}

interface GetPostSubCommentsRequest {
  userId: number;
  commentId: number;
}

interface UpdatePostSubCommentRequest {
  subCommentId: number;
  comment?: string;
  tags?: string[];
}

interface PostTotalSubComments {
  commentId: number;
  totalSubComments: number;
}

interface PostSubComment {
  subCommentId: number;
  commentId: number;
  userName: string;
  comment: string;
  tags: string[];
  edited: boolean;
  liked?: boolean;
  totalSubCommentLikes?: number;
  createdAt: Date;
  updatedAt?: Date | null;
}
