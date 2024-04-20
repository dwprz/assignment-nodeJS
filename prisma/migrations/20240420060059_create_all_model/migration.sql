-- CreateTable
CREATE TABLE "admins" (
    "adminId" SERIAL NOT NULL,
    "userName" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "refreshToken" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "userName" VARCHAR(100) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "photoProfile" VARCHAR(300),
    "role" VARCHAR(15) NOT NULL DEFAULT 'USER',
    "refreshToken" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "userFollows" (
    "follower" TEXT NOT NULL,
    "following" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "userFollows_pkey" PRIMARY KEY ("follower","following")
);

-- CreateTable
CREATE TABLE "posts" (
    "postId" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "body" TEXT NOT NULL,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "userName" TEXT NOT NULL,
    "contents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "userPostLikes" (
    "userName" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "userPostLikes_pkey" PRIMARY KEY ("userName","postId")
);

-- CreateTable
CREATE TABLE "userPostComments" (
    "commentId" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "userPostComments_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "userPostCommentLikes" (
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "userPostCommentLikes_pkey" PRIMARY KEY ("userId","commentId")
);

-- CreateTable
CREATE TABLE "userPostSubComments" (
    "subCommentId" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "userPostSubComments_pkey" PRIMARY KEY ("subCommentId")
);

-- CreateTable
CREATE TABLE "userPostSubCommentLikes" (
    "userId" INTEGER NOT NULL,
    "subCommentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "userPostSubCommentLikes_pkey" PRIMARY KEY ("userId","subCommentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_userName_key" ON "admins"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "admins_refreshToken_key" ON "admins"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_refreshToken_key" ON "users"("refreshToken");

-- AddForeignKey
ALTER TABLE "userFollows" ADD CONSTRAINT "userFollows_follower_fkey" FOREIGN KEY ("follower") REFERENCES "users"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userFollows" ADD CONSTRAINT "userFollows_following_fkey" FOREIGN KEY ("following") REFERENCES "users"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userName_fkey" FOREIGN KEY ("userName") REFERENCES "users"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostLikes" ADD CONSTRAINT "userPostLikes_userName_fkey" FOREIGN KEY ("userName") REFERENCES "users"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostLikes" ADD CONSTRAINT "userPostLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostComments" ADD CONSTRAINT "userPostComments_userName_fkey" FOREIGN KEY ("userName") REFERENCES "users"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostComments" ADD CONSTRAINT "userPostComments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostCommentLikes" ADD CONSTRAINT "userPostCommentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostCommentLikes" ADD CONSTRAINT "userPostCommentLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "userPostComments"("commentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostSubComments" ADD CONSTRAINT "userPostSubComments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "userPostComments"("commentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostSubComments" ADD CONSTRAINT "userPostSubComments_userName_fkey" FOREIGN KEY ("userName") REFERENCES "users"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostSubCommentLikes" ADD CONSTRAINT "userPostSubCommentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostSubCommentLikes" ADD CONSTRAINT "userPostSubCommentLikes_subCommentId_fkey" FOREIGN KEY ("subCommentId") REFERENCES "userPostSubComments"("subCommentId") ON DELETE RESTRICT ON UPDATE CASCADE;
