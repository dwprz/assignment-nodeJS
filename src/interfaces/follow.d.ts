interface CreateUserFollowRequest {
  followerUserName: string;
  followingUserName: string;
}

interface DeleteUserFollowRequest {
  followerUserName: string;
  followingUserName: string;
}

interface UserFollow {
  follower: string;
  following: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface Following {
  following: string;
}

interface Follower {
  follower: string;
}
