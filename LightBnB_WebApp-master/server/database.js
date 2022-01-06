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
  //   --WHERE city LIKE '%ancouv%'
  //   GROUP BY properties.id, property_reviews.rating
  //   --HAVING AVG(property_reviews.rating) >= 4
  //   --ORDER BY cost_per_night
  //   LIMIT $1
  // `;

  const values = [];

  if (options.city) {
    values.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${values.length} `;
  }

  if (options.owner_id) {
    values.push(options.owner_id);
    if (options.city) {
      queryString += `AND owner_id = $${values.length}`;
    } else {
      queryString += `WHERE owner_id = $${values.length}`;
    }
  }

  queryString += `
    GROUP BY properties.id
  `;
  
  if (options.minimum_price_per_night) {
    values.push(options.minimum_price_per_night * 100);
    queryString += `HAVING properties.cost_per_night > $${values.length} `;
  }

  if (options.maximum_price_per_night) {
    values.push(options.maximum_price_per_night * 100);
    if (options.minimum_price_per_night) {
      queryString += `AND properties.cost_per_night < $${values.length} `;
    } else {
      queryString += `HAVING properties.cost_per_night < $${values.length} `;
    }

  }

  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    if (options.minimum_price_per_night || options.maximum_price_per_night) {
      queryString += `AND AVG(property_reviews.rating) >= $${values.length}`;
    } else {
      queryString += `HAVING AVG(property_reviews.rating) >= $${values.length}`;
    }
  }


  values.push(limit);
  queryString += `
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
