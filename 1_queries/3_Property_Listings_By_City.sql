-- SELECT *
-- FROM (
-- SELECT distinct properties.id, properties.title, cost_per_night,
-- AVG(property_reviews.rating) AS average_rating
-- FROM properties
-- JOIN property_reviews ON property_reviews.property_id = properties.id
-- WHERE city LIKE '%Vancouver%'
-- GROUP BY properties.id, properties.title, cost_per_night
-- ORDER BY cost_per_night
-- LIMIT 10
-- )as foo
-- WHERE average_rating >= 4;

--select all?

SELECT distinct properties.id, properties.title, cost_per_night,
AVG(property_reviews.rating) AS average_rating
FROM properties
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10
;

-- SELECT properties.*, avg(property_reviews.rating) as average_rating
-- FROM properties
-- JOIN property_reviews ON properties.id = property_id
-- WHERE city LIKE '%ancouv%'
-- GROUP BY properties.id
-- HAVING avg(property_reviews.rating) >= 4
-- ORDER BY cost_per_night
-- LIMIT 10;