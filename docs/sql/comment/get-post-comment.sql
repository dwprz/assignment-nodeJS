SELECT 
    upc.*, 
    CASE WHEN upcl."userId" IS NULL THEN FALSE ELSE TRUE 
    END as liked 
FROM 
    "userPostComments" as upc
LEFT JOIN 
    "userPostCommentLikes" as upcl ON upcl."commentId" = upc."commentId" AND upcl."userId" = 1
WHERE 
    "postId" = 1;


SELECT 
    upc."commentId", 
    COUNT(upsc."subCommentId") as "totalSubComments"
FROM 
    "userPostComments" as upc
LEFT JOIN 
    "userPostSubComments" as upsc ON upsc."commentId" = upc."commentId"
WHERE 
    upc."postId" = 1
GROUP 
    BY upc."commentId";


