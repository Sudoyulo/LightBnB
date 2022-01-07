const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
      return (null);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => result.rows[0]) // <-- also [0]?? How do I check?
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  
  const queryString = `
  INSERT INTO users (
    name, email, password) 
    VALUES (
    $1, $2, $3)
    RETURNING *;
  `;
  const values = [user.name, user.email, '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'];

  return pool.query(queryString, values)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
 
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT reservations.* , properties.*, AVG(rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.reservation_id = reservations.id
  WHERE reservations.guest_id = $1
  AND start_date < now()
  GROUP BY reservations.id, properties.id, property_reviews.rating
  `;
  const values = [guest_id];

  return pool.query(queryString, values)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {

  let queryString = `
    SELECT properties.*, AVG(rating) AS average_rating
    FROM properties 
    JOIN property_reviews ON property_reviews.property_id = properties.id
    `;

  const values = [];

  const queryFilter = [];

  if (options.city) {
    values.push(`%${options.city}%`);
    queryFilter.push(` city LIKE $${values.length} `);
  }

  if (options.owner_id) {
    values.push(options.owner_id);
    queryFilter.push(` owner_id = $${values.length}`);
  }

  if (options.minimum_price_per_night) {
    values.push(options.minimum_price_per_night * 100);
    queryFilter.push(` properties.cost_per_night > $${values.length} `);
  }

  if (options.maximum_price_per_night) {
    values.push(options.maximum_price_per_night * 100);
    queryFilter.push(` properties.cost_per_night < $${values.length} `);
  }

  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    queryFilter.push(` property_reviews.rating >= $${values.length} `);
  }

  if (queryFilter.length > 0) {
    queryString += `WHERE ${queryFilter.join(' AND ')}`;
  }
  
  values.push(limit);

  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${values.length};
  `;

  return pool
    .query(queryString, values)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties 
    (
      title, description, owner_id, 
      cover_photo_url, thumbnail_photo_url, 
      cost_per_night, parking_spaces, 
      number_of_bathrooms, number_of_bedrooms, active, 
      province, city, country, street, post_code) 
      VALUES (
        $1, $2, $3, 
        $4, $5, 
        $6, $7, 
        $8, $9, $10, 
        $11, $12, $13, $14, $15
      )
    RETURNING *;
  `;
  const values = [property.title, property.description, property.owner_id,
    property.cover_photo_url, property.thumbnail_photo_url,
    property.cost_per_night, property.parking_spaces,
    property.number_of_bathrooms, property.number_of_bedrooms, true,
    property.province, property.city, property.country, property.street, property.post_code];

  return pool.query(queryString, values)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addProperty = addProperty;