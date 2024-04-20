import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import { PrismaService } from 'src/common/services/prisma.service';

export class PostServiceUtil {
  static deleteFiles(data: CreatePostRequest) {
    data.contents.forEach((content) => {
      const subFolder = content.split('/')[4];
      const fileName = content.split('/')[5];
      const filePath = process.cwd() + `/public/posts/${subFolder}/${fileName}`;

      fs.unlinkSync(filePath);
    });
  }

  static async getPostsLikesByPostId(
    prismaService: PrismaService,
    postIds: number[],
  ) {
    const postsLikes = (await prismaService.$queryRaw`
    SELECT 
        p."postId", COUNT(upl."postId") as "totalLikes" 
    FROM 
        posts as p
    LEFT JOIN 
        "userPostLikes" as upl ON p."postId" = upl."postId"
    WHERE 
        p."postId" in (${Prisma.join(postIds)})
    GROUP 
        BY p."postId";`) as PostTotalLikes[];

    return postsLikes;
  }

  static async getPostsCommentsByPostId(
    prismaService: PrismaService,
    postIds: number[],
  ) {
    const postsComments = (await prismaService.$queryRaw`
    SELECT 
        p."postId", COUNT(upc."commentId") + COUNT(upsc."subCommentId") as "totalComments"
    FROM 
        posts as p
    LEFT JOIN
        "userPostComments" as upc ON upc."postId" = p."postId"
    LEFT JOIN 
        "userPostSubComments" as upsc ON upsc."commentId" = upc."commentId"
    WHERE 
        p."postId" in (${Prisma.join(postIds)})
    GROUP BY 
        p."postId";`) as PostTotalComments[];

    return postsComments;
  }

  static async getLikedPostsByUser(
    prismaService: PrismaService,
    postIds: number[],
    userName: string,
  ) {
    const likedPostsByUser = (await prismaService.$queryRaw`
    SELECT
        p."postId",
        CASE WHEN upl."userName" IS NULL THEN FALSE ELSE TRUE
        END as liked
    FROM
        posts as p
    LEFT JOIN "userPostLikes" as upl ON upl."postId" = p."postId"
        AND upl."userName" = ${userName}
    WHERE
        p."postId" in (${Prisma.join(postIds)});`) as LikedPostByUser[];

    return likedPostsByUser;
  }

  static processingPostsForLogedInUser(
    posts: Post[],
    postsLikes: PostTotalLikes[],
    postsComments: PostTotalComments[],
    likedPostsByUser: LikedPostByUser[],
  ) {
    const processedPosts = posts.map((post) => {
      const { totalLikes } = postsLikes.find(
        (like) => like.postId === post.postId,
      );

      const { totalComments } = postsComments.find(
        (comment) => comment.postId === post.postId,
      );

      const { liked } = likedPostsByUser.find(
        (like) => like.postId === post.postId,
      );

      return {
        ...post,
        totalLikes: Number(totalLikes),
        totalComments: Number(totalComments),
        liked: liked,
      };
    });

    return processedPosts;
  }

  static processingPostsForUnauthenticatedUser(
    posts: Post[],
    postsLikes: PostTotalLikes[],
    postsComments: PostTotalComments[],
  ) {
    const processedPosts = posts.map((post) => {
      const { totalLikes } = postsLikes.find(
        (like) => like.postId === post.postId,
      );

      const { totalComments } = postsComments.find(
        (comment) => comment.postId === post.postId,
      );

      return {
        ...post,
        totalLikes: Number(totalLikes),
        totalComments: Number(totalComments),
      };
    });

    return processedPosts;
  }
}
