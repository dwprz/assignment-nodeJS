SELECT 
    upsc.*, 
    COUNT(upscl."subCommentId") as "totalSubCommentLikes",
    CASE 
        WHEN upscl."userId" IS NULL THEN FALSE 
        ELSE TRUE
    END as liked
FROM 
    "userPostSubComments" as upsc
LEFT JOIN 
    "userPostSubCommentLikes" as upscl ON upscl."subCommentId" = upsc."subCommentId" 
    AND upscl."userId" = 1
WHERE 
    upsc."commentId" = 2
GROUP BY 
    upsc."subCommentId", upscl."userId";

