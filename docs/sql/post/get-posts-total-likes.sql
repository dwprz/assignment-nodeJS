SELECT 
    p."postId", COUNT(upl."postId") as "totalLikes" 
FROM 
    posts as p
LEFT JOIN 
    "userPostLikes" as upl ON p."postId" = upl."postId"
WHERE 
    p."postId" in (3, 2 ,1)
GROUP 
    BY p."postId";