SELECT 
    p.*
FROM  posts as p
ORDER BY RANDOM()
    LIMIT 20 OFFSET 0;