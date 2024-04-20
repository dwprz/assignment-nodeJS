SELECT 
    p."postId", COUNT(upc."commentId") + COUNT(upsc."subCommentId") as "totalComments"
FROM 
    posts as p
LEFT JOIN
    "userPostComments" as upc ON upc."postId" = p."postId"
LEFT JOIN 
    "userPostSubComments" as upsc ON upsc."commentId" = upc."commentId"
WHERE 
    p."postId" in (3, 2, 1)
GROUP BY 
    p."postId";