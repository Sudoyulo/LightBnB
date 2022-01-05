SELECT properties.id, properties.title, cost_per_night, reservations.start_date, AVG(property_reviews.rating) AS average_rating
FROM properties
JOIN reservations ON reservations.property_id = properties.id
JOIN property_reviews ON property_reviews.property_id = properties.id
JOIN users ON users.id = properties.owner_id
WHERE reservations.guest_id = 1
GROUP BY properties.id, properties.title, cost_per_night, reservations.start_date, reservations.end_date 
HAVING reservations.end_date < now()::date
ORDER BY reservations.start_date
LIMIT 10
;