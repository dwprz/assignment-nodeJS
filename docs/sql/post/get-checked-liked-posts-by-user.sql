SELECT
    p."postId",
    CASE WHEN upl."userName" IS NULL THEN FALSE ELSE TRUE
    END as liked
FROM
    posts as p
LEFT JOIN "userPostLikes" as upl ON upl."postId" = p."postId"
    AND upl."userName" = 'johndoe123'
WHERE
    p."postId" in (3, 2, 1);